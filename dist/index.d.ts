export type Color = [number, number, number] | `#${string}`;
export interface Format {
    backgroundColor?: Color;
    bold?: boolean;
    color?: Color;
    fontSize?: number;
    highlight?: Color;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
}
export type List = 'bullet' | 'number';
export default class RTFFER {
    #private;
    private colors;
    private content;
    private fonts;
    constructor();
    enterList(type: List): ListCollector;
    finalize(): string;
    paragraph(content: string, format?: Format): this;
    write(content: string, format?: Format): this;
    writeLine(): this;
    writeLine(content: string, format?: Format): this;
    writeList(items: (string | [string, Format])[], type: List): this;
}
declare class ListCollector {
    private items;
    private parent;
    private type;
    constructor(parent: RTFFER, type: List);
    add(content: string, format?: Format): this;
    end(): RTFFER;
}
export {};
