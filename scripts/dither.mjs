// Atkinson-dither an 8-bit greyscale PNG into a 1-bit PNG: ink opaque, paper transparent.
// Used for the background specimen. No dependencies beyond node:zlib.
//
//   node scripts/dither.mjs docs/art/monstera-1.png static/monstera.png --rotate 16
//
// --scale  resample factor before dithering (finer grain at display size)
// --lift   tone curve exponent below 1 lightens the leaf, so it reads as stipple, not a solid mass
// --paper  values at or above this are treated as clean paper (no stray dots in the background)
// --rotate tilt in degrees, clockwise, applied before dithering so the dots stay square
import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync, inflateSync } from 'node:zlib';

const [input, output, ...rest] = process.argv.slice(2);
if (!input || !output) {
	console.error(
		'usage: node scripts/dither.mjs <in.png> <out.png> [--scale n] [--lift n] [--paper n] [--rotate deg]'
	);
	process.exit(1);
}
/** @param {string} name @param {number} fallback */
const opt = (name, fallback) => {
	const i = rest.indexOf(`--${name}`);
	return i === -1 ? fallback : Number(rest[i + 1]);
};
const scale = opt('scale', 2);
const lift = opt('lift', 0.8);
const paper = opt('paper', 232);
const rotate = opt('rotate', 16);

/** @param {Buffer} buf */
function decodeGrey(buf) {
	let pos = 8;
	let width = 0;
	let height = 0;
	const idat = [];
	while (pos < buf.length) {
		const length = buf.readUInt32BE(pos);
		const type = buf.toString('latin1', pos + 4, pos + 8);
		const data = buf.subarray(pos + 8, pos + 8 + length);
		if (type === 'IHDR') {
			width = data.readUInt32BE(0);
			height = data.readUInt32BE(4);
			if (data[8] !== 8 || data[9] !== 0 || data[12] !== 0) {
				throw new Error('expected a non-interlaced 8-bit greyscale PNG');
			}
		}
		if (type === 'IDAT') idat.push(data);
		pos += 12 + length;
	}
	const raw = inflateSync(Buffer.concat(idat));
	const px = new Uint8Array(width * height);
	for (let y = 0; y < height; y++) {
		const filter = raw[y * (width + 1)];
		for (let x = 0; x < width; x++) {
			const v = raw[y * (width + 1) + 1 + x];
			const a = x > 0 ? px[y * width + x - 1] : 0;
			const b = y > 0 ? px[(y - 1) * width + x] : 0;
			const c = x > 0 && y > 0 ? px[(y - 1) * width + x - 1] : 0;
			let p = 0;
			if (filter === 1) p = a;
			else if (filter === 2) p = b;
			else if (filter === 3) p = (a + b) >> 1;
			else if (filter === 4) {
				const e = a + b - c;
				const da = Math.abs(e - a);
				const db = Math.abs(e - b);
				const dc = Math.abs(e - c);
				p = da <= db && da <= dc ? a : db <= dc ? b : c;
			}
			px[y * width + x] = (v + p) & 0xff;
		}
	}
	return { width, height, px };
}

// Scale by k and rotate by deg (clockwise) about the centre. The canvas grows to fit the
// rotated image, and the new corners are paper.
/**
 * @param {{ width: number, height: number, px: Uint8Array }} img
 * @param {number} k
 * @param {number} deg
 */
function resample({ width, height, px }, k, deg) {
	const a = (deg * Math.PI) / 180;
	const cos = Math.cos(a);
	const sin = Math.sin(a);
	const w = Math.round((width * Math.abs(cos) + height * Math.abs(sin)) * k);
	const h = Math.round((width * Math.abs(sin) + height * Math.abs(cos)) * k);
	/** @param {number} x @param {number} y */
	const at = (x, y) => (x < 0 || y < 0 || x >= width || y >= height ? 255 : px[y * width + x]);
	const out = new Float32Array(w * h);
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const dx = (x + 0.5 - w / 2) / k;
			const dy = (y + 0.5 - h / 2) / k;
			const sx = dx * cos + dy * sin + width / 2 - 0.5;
			const sy = -dx * sin + dy * cos + height / 2 - 0.5;
			const x0 = Math.floor(sx);
			const y0 = Math.floor(sy);
			const fx = sx - x0;
			const fy = sy - y0;
			const top = at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx;
			const bottom = at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx;
			out[y * w + x] = top * (1 - fy) + bottom * fy;
		}
	}
	return { width: w, height: h, px: out };
}

// Atkinson: spreads 6/8 of the error, which keeps highlights open and darks crisp.
/** @param {{ width: number, height: number, px: Float32Array }} img */
function atkinson({ width, height, px }) {
	const ink = new Uint8Array(width * height);
	const v = px.map((p) => (p >= paper ? 255 : 255 * Math.pow(p / 255, lift)));
	const spread = [
		[1, 0],
		[2, 0],
		[-1, 1],
		[0, 1],
		[1, 1],
		[0, 2]
	];
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = y * width + x;
			const on = v[i] < 128;
			ink[i] = on ? 1 : 0;
			const err = (v[i] - (on ? 0 : 255)) / 8;
			for (const [dx, dy] of spread) {
				const nx = x + dx;
				const ny = y + dy;
				if (nx >= 0 && nx < width && ny < height) v[ny * width + nx] += err;
			}
		}
	}
	return ink;
}

/** @param {string} type @param {Buffer} data */
function chunk(type, data) {
	const head = Buffer.alloc(8);
	head.writeUInt32BE(data.length, 0);
	head.write(type, 4, 'latin1');
	const crc = Buffer.alloc(4);
	crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
	return Buffer.concat([head, data, crc]);
}

/** @param {Buffer} buf */
function crc32(buf) {
	let c = ~0;
	for (const byte of buf) {
		c ^= byte;
		for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
	}
	return ~c >>> 0;
}

// Indexed 1-bit PNG: index 0 is transparent paper, index 1 is opaque ink.
/** @param {number} width @param {number} height @param {Uint8Array} ink */
function encode1bit(width, height, ink) {
	const stride = Math.ceil(width / 8);
	const raw = Buffer.alloc((stride + 1) * height);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (ink[y * width + x]) raw[y * (stride + 1) + 1 + (x >> 3)] |= 0x80 >> (x & 7);
		}
	}
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(width, 0);
	ihdr.writeUInt32BE(height, 4);
	ihdr[8] = 1;
	ihdr[9] = 3;
	return Buffer.concat([
		Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		chunk('IHDR', ihdr),
		chunk('PLTE', Buffer.from([255, 255, 255, 0, 0, 0])),
		chunk('tRNS', Buffer.from([0, 255])),
		chunk('IDAT', deflateSync(raw, { level: 9 })),
		chunk('IEND', Buffer.alloc(0))
	]);
}

// Trim to the ink, so CSS can place the leaf by its own edges.
/** @param {number} width @param {number} height @param {Uint8Array} ink */
function crop(width, height, ink) {
	let x0 = width;
	let y0 = height;
	let x1 = 0;
	let y1 = 0;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (!ink[y * width + x]) continue;
			x0 = Math.min(x0, x);
			y0 = Math.min(y0, y);
			x1 = Math.max(x1, x);
			y1 = Math.max(y1, y);
		}
	}
	const w = x1 - x0 + 1;
	const h = y1 - y0 + 1;
	const out = new Uint8Array(w * h);
	for (let y = 0; y < h; y++)
		out.set(ink.subarray((y0 + y) * width + x0, (y0 + y) * width + x1 + 1), y * w);
	return { width: w, height: h, ink: out };
}

const img = resample(decodeGrey(readFileSync(input)), scale, rotate);
const trimmed = crop(img.width, img.height, atkinson(img));
const png = encode1bit(trimmed.width, trimmed.height, trimmed.ink);
writeFileSync(output, png);
console.log(`${output}: ${trimmed.width}x${trimmed.height}, ${png.length} bytes`);
