import asciidoctor from 'asciidoctor'

/**
 * Converts AsciiDoc content to HTML
 * @param {string} content - The AsciiDoc content to convert
 * @returns {{code: string}} - Object containing the HTML output
 */
export function html(content) {
  const Asciidoctor = asciidoctor()
  const html = Asciidoctor.convert(content, { attributes: { 'showTitle': true}})
  return { code: html.toString() }
}

/**
 * Converts AsciiDoc content to HTML
 * @param {string} filename - The filename of the AsciiDoc
 */
export function loadFile(filename) {
  const Asciidoctor = asciidoctor()
  return Asciidoctor.loadFile(filename, { attributes: { 'showTitle': true}})
}

/**
 * Returns a SvelteKit preprocessor for AsciiDoc
 * @returns {{ name: string, markup: (params: { content: string, filename: string }) => { code: string } | undefined }}
 */
function asciidoc() {
  return {
    name: 'asciidoc',
    markup({ content, filename }) {
      if (filename.endsWith('.asciidoc') || filename.endsWith('.adoc')) {
        return html(content);
      }
    }
  }
}

export default asciidoc
