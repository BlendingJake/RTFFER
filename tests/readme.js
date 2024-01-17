import RTFFER from '../dist/index.js';
import fs from 'node:fs';

const rtf = new RTFFER();
rtf.writeLine('RTFFER', { bold: true, fontSize: 24 })
    .paragraph(
        'A basic library for writing RTF files in JavaScript/TypeScript. ' +
            'The necessary RTF headers are created, including the color ' +
            'declaration block. Unicode characters are automatically escaped.'
    )
    .writeLine()
    .writeLine()
    .writeLine('Supported Formatting', { bold: true, fontSize: 18 })
    .enterList('bullet')
    .add('Background Color: { background: "#0000ff }', {
        backgroundColor: '#0000ff'
    })
    .add('Bold: { bold: true }', { bold: true })
    .add('Font Size: { fontSize: 8 }', { fontSize: 8 })
    .add('Highlight: { highlight: "#f7f703" }', { highlight: '#f7f703' })
    .add('Italic: { italic: true }', { italic: true })
    .add('Strike-through: { strikethrough: true }', { strikethrough: true })
    .add('Text Color: { color: "#ff0000 }', { color: '#ff0000' })
    .add('Underline: { underline: true }', { underline: true })
    .end();
fs.writeFile('./README.rtf', rtf.finalize(), () => {});
console.log(rtf.finalize());
