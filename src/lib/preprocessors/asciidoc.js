import asciidoctor from 'asciidoctor'

/**
 * Converts AsciiDoc content to HTML
 * @param {string} content - The AsciiDoc content to convert
 * @returns {{code: string}} - Object containing the HTML output
 */
function html(content) {
  const Asciidoctor = asciidoctor()
  const html = Asciidoctor.convert(content, { attributes: { 'showTitle': true}})
  return { code: html.toString() }
}

function asciidoc() {
  return {
    name: 'asciidoc',
    markup({ content, filename }) {
      if (filename.endsWith('.asciidoc')) {
        console.log(filename);
        return html(content);
      }
    }
  }
}

export default asciidoc
