import { Record } from '@quenk/noni/lib/data/record';
/**
 * WMLDOMAttrs is a record of attributes bound for a WMLDOMElement.
 */
export interface WMLDOMAttrs extends Record<string | number | Function> {
}
/**
 * WMLNodeList implementation.
 * @private
 */
export declare class WMLNodeList implements NodeListOf<WMLDOMNode> {
    [index: number]: WMLDOMNode;
    length: number;
    item(): WMLDOMNode;
    forEach(): void;
}
/**
 * WMLDOMNode implements the properties and methods of the DOM Node interface to
 * allow a fake DOM to be built in server side code.
 *
 * Most of the methods and properties cannot be relied on and should not be
 * used.
 */
export declare class WMLDOMNode implements Node {
    nodeName: string;
    nodeType: number;
    constructor(nodeName: string, nodeType: number);
    readonly ATTRIBUTE_NODE: number;
    readonly CDATA_SECTION_NODE: number;
    readonly COMMENT_NODE: number;
    readonly DOCUMENT_FRAGMENT_NODE: number;
    readonly DOCUMENT_NODE: number;
    readonly DOCUMENT_POSITION_CONTAINED_BY: number;
    readonly DOCUMENT_POSITION_CONTAINS: number;
    readonly DOCUMENT_POSITION_DISCONNECTED: number;
    readonly DOCUMENT_POSITION_FOLLOWING: number;
    readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: number;
    readonly DOCUMENT_POSITION_PRECEDING: number;
    readonly DOCUMENT_TYPE_NODE: number;
    readonly ELEMENT_NODE: number;
    readonly ENTITY_NODE: number;
    readonly ENTITY_REFERENCE_NODE: number;
    readonly NOTATION_NODE: number;
    readonly PROCESSING_INSTRUCTION_NODE: number;
    readonly TEXT_NODE: number;
    baseURI: string;
    childNodes: WMLNodeList;
    firstChild: null;
    isConnected: boolean;
    lastChild: null;
    namespaceURI: null;
    nextSibling: null;
    nodeValue: null;
    ownerDocument: null;
    parentElement: null;
    parentNode: null;
    previousSibling: null;
    textContent: null;
    addEventListener(): void;
    dispatchEvent(): boolean;
    removeEventListener(): void;
    appendChild<T extends Node>(newChild: T): T;
    cloneNode(): this;
    compareDocumentPosition(): number;
    contains(): boolean;
    getRootNode(): Node;
    hasChildNodes(): boolean;
    insertBefore<T extends Node>(newChild: T): T;
    isDefaultNamespace(): boolean;
    isEqualNode(): boolean;
    isSameNode(): boolean;
    lookupNamespaceURI(): null;
    lookupPrefix(): null;
    normalize(): void;
    remove(): void;
    before(): void;
    after(): void;
    replaceWith(): void;
    removeChild<T extends Node>(oldChild: T): T;
    replaceChild<T extends Node>(_: Node, oldChild: T): T;
}
/**
 * WMLDOMText is used to represent Text nodes on the server side.
 * @private
 */
export declare class WMLDOMText extends WMLDOMNode {
    value: string;
    constructor(value: string);
    renderToString(): string;
}
/**
 * WMLDOMElement is used to represent Element nodes on the server side.
 * @private
 */
export declare class WMLDOMElement extends WMLDOMNode {
    tag: string;
    attrs: WMLDOMAttrs;
    children: Node[];
    constructor(tag: string, attrs: WMLDOMAttrs, children?: Node[]);
    get innerHTML(): string;
    get outerHTML(): string;
}
/**
 * escapeAttrs escapes each key value pair of a WMLDOMAttrs.
 */
export declare const escapeAttrs: (attrs: WMLDOMAttrs) => Record<string | number | Function>;
/**
 * escapeAttrValue for safe browser display.
 */
export declare const escapeAttrValue: (value: string) => string;
/**
 * escapeHTML for safe browser display.
 */
export declare const escapeHTML: (value: string) => string;
/**
 * createTextNode wrapper.
 */
export declare const createTextNode: (txt: string) => Node;
/**
 * createElement wrapper.
 */
export declare const createElement: (tag: string, attrs?: WMLDOMAttrs, children?: Node[]) => Node;
