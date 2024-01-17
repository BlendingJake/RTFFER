# RTFFER

A basic library for writing RTF (Rich Text Format) files in JavaScript/TypeScript. The necessary RTF headers are created, including the color declaration block. Unicode characters are automatically escaped. Please note, RTF files support a very wide range of formatting and this library covers only a small portion.

## Basic Usage

```javascript
import RTFFER from 'rtffer';

const writer = new RTFFER();
writer
    .paragraph(
        'Here is an example of a RTF (Rich Text Format) file being written ' +
            'with the RTFFER library.'
    )
    .writeLine()
    .write("Here's some large, bold text ", { bold: true, fontSize: 24 })
    .writeLine("and here's more text on the same line, but is colored red", {
        color: '#ff0000'
    });

const rtf = writer.finalize();
```

As shown in the example above, `RTFFER` heavily supports chaining and allows sequential calls to write. Building lists can be done similarly.
A more extensive example can be found in [tests/readme.js](tests/readme.js).

## Supported Formatting

-   Background Color
-   Bold
-   Font Size
-   Highlight
-   Italic
-   Strike-through
-   Text Color
-   Underline

## Lists

There are two ways to create a list: progressively through calls to `enterList(...)` followed by one or more `add(...)` calls and then finally a `end()` call, or by providing all the items at once with `writeList(...)`.

```javascript
new RTFFER()
    .write('Here is a list of items: ')
    .enterList('number')
    .add('A plain text item')
    .add('An item that is underlined', { underline: true })
    .add('An item that is highlighted', { highlight: '#0000ff' })
    .end()
    .paragraph('All of this information will come after the numbered list.');
```

## API

-   `Color = [number, number, number] | '#<hex color>'`
-   `Format`
    -   `backgroundColor?: Color`
    -   `bold?: boolean`
    -   `color?: Color`
    -   `fontSize?: number`
    -   `highlight?: Color`
    -   `italic?: boolean`
    -   `strikethrough?: boolean`
    -   `underline?: boolean`
-   `List = 'bullet' | 'number'`
-   `ListCollector`
    -   `add(content: string, format?: Format): ListCollector`
    -   `end(): RTFFER`
-   `RTFFER`
    -   `enterList(type: List): ListCollector`
    -   `finalize(): string`
    -   `paragraph(content: string, format?: Format): RTFFER`
    -   `write(content: string, format?: Format): RTFFER`
    -   `writeLine(content?: string, format?: Format): RTFFER`
    -   `writeList(items: (string | [string, Format])[], type: List): RTFFER`
