import { Content } from './';
/**
 * SSRNode is the interface all server side rendered (ssr) nodes implement.
 *
 * The renderToString() method can be applied to receive a string representation
 * of content.
 */
export interface SSRNode {
    /**
     * renderToString this node and all its child contents.
     */
    renderToString(): string;
}
/**
 * SSRText is used to represent Text nodes on the server side.
 */
export declare class SSRText implements SSRNode {
    value: string;
    constructor(value: string);
    renderToString(): string;
}
/**
 * SSRElement is used to represent Element nodes on the server side.
 */
export declare class SSRElement {
    name: string;
    constructor(name: string);
    attrs: string[];
    children: SSRNode[];
    setAttribute(key: string, value: string): void;
    appendChild(node: Content): void;
    renderToString(): string;
}
/**
 * createTextNode wrapper.
 */
export declare const createTextNode: (txt: string) => SSRText | Text;
/**
 * createElement wrapper.
 */
export declare const createElement: (name: string) => Element | SSRElement;
