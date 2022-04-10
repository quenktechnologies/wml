/**
 * This module provides functions used in templates to generate supported DOM
 * nodes.
 *
 * The idea here is to provide an abstraction over DOM construction so
 * we can detect whether we are in a browser or elsewhere and adjust to
 * suite.
 */
import { Record } from '@quenk/noni/lib/data/record';
import { Type } from '@quenk/noni/lib/data/type';
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
    readonly ATTRIBUTE_NODE = -1;
    readonly CDATA_SECTION_NODE = -1;
    readonly COMMENT_NODE = -1;
    readonly DOCUMENT_FRAGMENT_NODE = -1;
    readonly DOCUMENT_NODE = -1;
    readonly DOCUMENT_POSITION_CONTAINED_BY = -1;
    readonly DOCUMENT_POSITION_CONTAINS = -1;
    readonly DOCUMENT_POSITION_DISCONNECTED = -1;
    readonly DOCUMENT_POSITION_FOLLOWING = -1;
    readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = -1;
    readonly DOCUMENT_POSITION_PRECEDING = -1;
    readonly DOCUMENT_TYPE_NODE = -1;
    readonly ELEMENT_NODE = -1;
    readonly ENTITY_NODE = -1;
    readonly ENTITY_REFERENCE_NODE = -1;
    readonly NOTATION_NODE = -1;
    readonly PROCESSING_INSTRUCTION_NODE = -1;
    readonly TEXT_NODE = -1;
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
    get textContent(): string;
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
    escape: boolean;
    constructor(value: string, escape?: boolean);
    get textContent(): string;
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
    setAttribute(key: string, value: Type): void;
    appendChild<T extends Node>(newChild: T): T;
}
/**
 * isBrowser is set to true if we detect a window and document global variable.
 */
export declare const isBrowser: boolean;
/**
 * escapeAttrs escapes each key value pair of a WMLDOMAttrs.
 */
export declare const escapeAttrs: (attrs: WMLDOMAttrs) => Record<string | (<A, B>(a: A) => B)>;
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
export declare const createTextNode: (txt: Type) => Node;
/**
 * createUnsafeNode allows raw strings to be output without escaping.
 *
 * THIS MUST ONLY BE USED IF YOU ARE 100% SURE THE STRING IS SAFE TO OUTPUT!
 */
export declare const createUnsafeNode: (txt: Type) => Node;
export { createTextNode as text, createUnsafeNode as unsafe };
/**
 * createElement wrapper.
 */
export declare const createElement: (tag: string, attrs?: WMLDOMAttrs, children?: Node[]) => Element;
