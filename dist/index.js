export default class RTFFER {
    colors;
    content;
    fonts;
    constructor() {
        this.colors = [];
        this.content = [];
        this.fonts = ['{\\f1\\fnil\\fcharset2 Symbol;}'];
    }
    #encode(content) {
        const letters = new Array(content.length);
        let point;
        for (let i = 0; i < content.length; i += 1) {
            if (content[i] === '\n')
                letters[i] = '\\line';
            else if (content[i] === '\t')
                letters[i] = '\\tab';
            else if (content[i] === '\\')
                letters[i] = '\\\\';
            else if (content[i] === '{')
                letters[i] = '\\{';
            else if (content[i] === '}')
                letters[i] = '\\}';
            else {
                point = content.codePointAt(i);
                if (point >= 128)
                    letters[i] = `\\u${point}`; // \u<decimal point>
                else
                    letters[i] = content[i];
            }
        }
        return letters.join('');
    }
    enterList(type) {
        return new ListCollector(this, type);
    }
    finalize() {
        return [
            '{',
            '\\rtf1',
            '\\ansi',
            '\\deff0',
            '{\\fonttbl',
            this.fonts.join(''),
            '}',
            '{\\colortbl;',
            this.colors
                .map((c) => `\\red${c[0]}\\green${c[1]}\\blue${c[2]}`)
                .join(';'),
            this.colors.length > 0 ? ';' : '',
            '}',
            ...this.content,
            '}'
        ].join('');
    }
    #handleColor(color, controlCode) {
        let rgb;
        if (typeof color === 'string') {
            const hex = color.substring(1);
            rgb = [
                hex.substring(0, 2),
                hex.substring(2, 4),
                hex.substring(4)
            ].map((c) => parseInt(c, 16));
        }
        else
            rgb = color;
        let index = this.colors.findIndex((c) => rgb[0] === c[0] && rgb[1] === c[1] && rgb[2] === c[2]);
        if (index < 0) {
            this.colors.push(rgb);
            index = this.colors.length;
        }
        else
            index += 1; // account for 0 being taken
        return `${controlCode}${index}`;
    }
    #handleFormat(format = {}) {
        const parts = [];
        if (format.backgroundColor)
            parts.push(
            // multiple variations used for compatability
            '\\chshdng0', this.#handleColor(format.backgroundColor, '\\chcbpat'), this.#handleColor(format.backgroundColor, '\\cb'));
        if (format.bold)
            parts.push('\\b');
        if (format.color)
            parts.push(this.#handleColor(format.color, '\\cf'));
        if (format.fontSize)
            parts.push('\\fs' + format.fontSize * 2);
        if (format.highlight)
            parts.push(this.#handleColor(format.highlight, '\\highlight'));
        if (format.italic)
            parts.push('\\i');
        if (format.strikethrough)
            parts.push('\\strike');
        if (format.underline)
            parts.push('\\ul');
        return parts.join('');
    }
    #newLine() {
        this.content.push('\\line');
        return this;
    }
    paragraph(content, format = {}) {
        this.content.push('\\par', '\\pard', this.#handleFormat(format), ' ', this.#encode(content));
        return this;
    }
    write(content, format = {}) {
        const fmt = this.#handleFormat(format);
        this.content.push('{', fmt, fmt ? ' ' : '', this.#encode(content), '}');
        return this;
    }
    writeLine(content, format) {
        if (content)
            this.write(content, format);
        return this.#newLine();
    }
    writeList(items, type) {
        this.content.push('\\par\\pard{\\*\\pn', type === 'bullet' ? '\\pnlvlblt' : '\\pnlvlbody', type === 'number'
            ? '\\pnstart1\\pndec{\\pntxta.}' // start at 1 with decimal number and '.' after the number
            : "\\pnf1{\\pntxtb\\'B7}", // use font 1 (symbols) and put a bullet before the numbering
        '\\fi-360\\li480', // indent each line
        ...items
            .map((i) => {
            const c = typeof i === 'string' ? i : i[0];
            const f = this.#handleFormat(typeof i === 'object' ? i[1] : {});
            return `{${f} ${this.#encode(c)}}`;
        })
            .join('\\par '), '\\par\\pard}');
        return this;
    }
}
class ListCollector {
    items;
    parent;
    type;
    constructor(parent, type) {
        this.items = [];
        this.parent = parent;
        this.type = type;
    }
    add(content, format = {}) {
        this.items.push([content, format]);
        return this;
    }
    end() {
        this.parent.writeList(this.items, this.type);
        return this.parent;
    }
}
