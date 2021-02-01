import { Record, map, mapTo, forEach } from '@quenk/noni/lib/data/record';
import { Type,isString } from '@quenk/noni/lib/data/type';

/**
 * This module provides functions used in templates to generate supported DOM
 * nodes.
 *
 * The idea here is to provide an abstraction over DOM construction so
 * we can detect whether we are in a browser or elsewhere and adjust to
 * suite.
 */

const ATTRS_ESC_REGEX = /[><&\u2028\u2029]/g;

const HTML_ESC_REGEX = /["'&<>]/;

const ATTR_ESC_MAP: { [key: string]: string } = {

    '&': '\\u0026',

    '>': '\\u003e',

    '<': '\\u003c',

    '"': '\\u0022',

    '\u2028': '\\u2028',

    '\u2029': '\\u2029'

}

const HTML_ENT_MAP: { [key: string]: string } = {

    '"': '&quot;',

    '&': '&amp;',

    '\'': '&#x27;',

    '<': '&lt;',

    '>': '&gt;'

}

const voidElements = [
    'area',
    'base',
    'br',
    'col',
    'command',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
];

/**
 * WMLDOMAttrs is a record of attributes bound for a WMLDOMElement.
 */
export interface WMLDOMAttrs extends Record<string | number | Function> { }

/**
 * WMLNodeList implementation.
 * @private
 */
export class WMLNodeList implements NodeListOf<WMLDOMNode> {

    [index: number]: WMLDOMNode,

    length = 0;

    item() {

        return <WMLDOMNode><Type>null;

    }

    forEach() { }

}

/**
 * WMLDOMNode implements the properties and methods of the DOM Node interface to
 * allow a fake DOM to be built in server side code.
 *
 * Most of the methods and properties cannot be relied on and should not be 
 * used.
 */
export class WMLDOMNode implements Node {

    constructor(public nodeName: string, public nodeType: number) { }

    readonly ATTRIBUTE_NODE = Node.ATTRIBUTE_NODE;

    readonly CDATA_SECTION_NODE = Node.CDATA_SECTION_NODE;

    readonly COMMENT_NODE = Node.COMMENT_NODE;

    readonly DOCUMENT_FRAGMENT_NODE = Node.DOCUMENT_FRAGMENT_NODE;

    readonly DOCUMENT_NODE = Node.DOCUMENT_NODE;

    readonly DOCUMENT_POSITION_CONTAINED_BY =
        Node.DOCUMENT_POSITION_CONTAINED_BY;

    readonly DOCUMENT_POSITION_CONTAINS = Node.DOCUMENT_POSITION_CONTAINS;

    readonly DOCUMENT_POSITION_DISCONNECTED =
        Node.DOCUMENT_POSITION_DISCONNECTED;

    readonly DOCUMENT_POSITION_FOLLOWING = Node.DOCUMENT_POSITION_FOLLOWING;

    readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC =
        Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;

    readonly DOCUMENT_POSITION_PRECEDING = Node.DOCUMENT_POSITION_PRECEDING;

    readonly DOCUMENT_TYPE_NODE = Node.DOCUMENT_TYPE_NODE;

    readonly ELEMENT_NODE = Node.ELEMENT_NODE;

    readonly ENTITY_NODE = Node.ENTITY_NODE;

    readonly ENTITY_REFERENCE_NODE = Node.ENTITY_REFERENCE_NODE;

    readonly NOTATION_NODE = Node.NOTATION_NODE;

    readonly PROCESSING_INSTRUCTION_NODE = Node.PROCESSING_INSTRUCTION_NODE;

    readonly TEXT_NODE = Node.TEXT_NODE;

    baseURI = '';

    childNodes = new WMLNodeList();

    firstChild = null;

    isConnected = false;

    lastChild = null;

    namespaceURI = null;

    nextSibling = null;

    nodeValue = null;

    ownerDocument = null;

    parentElement = null;

    parentNode = null;

    previousSibling = null;

    textContent = null;

    addEventListener() { }

    dispatchEvent() {

        return false;

    }

    removeEventListener() { }

    appendChild<T extends Node>(newChild: T): T {

        return newChild;

    }

    cloneNode() {

        return this;

    }

    compareDocumentPosition() {

        return 0;

    }

    contains() {

        return false;

    }

    getRootNode(): Node {

        return this;

    }

    hasChildNodes() {

        return false;

    }

    insertBefore<T extends Node>(newChild: T): T {

        return newChild;

    }

    isDefaultNamespace() {

        return false;

    }

    isEqualNode() {

        return false;

    }

    isSameNode() {

        return false;

    }

    lookupNamespaceURI() {

        return null;

    }

    lookupPrefix() {

        return null;

    }

    normalize() { }

    remove() { }

    before() { }

    after() { }

    replaceWith() { }

    removeChild<T extends Node>(oldChild: T): T {

        return oldChild;

    }

    replaceChild<T extends Node>(_: Node, oldChild: T): T {

        return oldChild;

    }

}

/**
 * WMLDOMText is used to represent Text nodes on the server side.
 * @private
 */
export class WMLDOMText extends WMLDOMNode {

    constructor(public value: string) {

        super('#text', Node.TEXT_NODE);

    }

    renderToString(): string {

        return escapeHTML(this.value);

    }

}

/**
 * WMLDOMElement is used to represent Element nodes on the server side.
 * @private
 */
export class WMLDOMElement extends WMLDOMNode {

    constructor(
        public tag: string,
        public attrs: WMLDOMAttrs,
        public children: Node[] = []) { super(tag, Node.ELEMENT_NODE); }

    get innerHTML() {

        return this.children.map(c => {

            switch (c.nodeType) {

                case Node.TEXT_NODE:
                    return (<Text>c).textContent;

                case Node.ELEMENT_NODE:
                    return (<HTMLElement>c).outerHTML;

                default:
                    return '';

            }

        }).join('');

    }

    get outerHTML() {

        let { tag } = this;
        let content = this.innerHTML;

        let attrs = mapTo(this.attrs, (value, name) => !value ?
            name : `${name}="${escapeAttrValue('' + value)}"`).join(' ');

        let open = `<${tag} ${attrs}>`;

        return (voidElements.indexOf(tag) > -1) ?
            open : `<${open}>${content}</${tag}>`;

    }

}

const isBrowser = ((window != null) && (document != null));

/**
 * escapeAttrs escapes each key value pair of a WMLDOMAttrs.
 */
export const escapeAttrs = (attrs: WMLDOMAttrs) =>
    map(attrs, value => isString(value) ? escapeAttrValue(value) : value);

/**
 * escapeAttrValue for safe browser display.
 */
export const escapeAttrValue = (value: string) =>
    value.replace(ATTRS_ESC_REGEX, hit => ATTR_ESC_MAP[hit]);

/**
 * escapeHTML for safe browser display.
 */
export const escapeHTML = (value: string) =>
    value.replace(HTML_ESC_REGEX, hit => HTML_ENT_MAP[hit]);

/**
 * createTextNode wrapper.
 */
export const createTextNode = (txt: string): Node => isBrowser ?
    document.createTextNode(txt) : new WMLDOMText(escapeHTML(txt));

/**
 * createElement wrapper.
 */
export const createElement = (
    tag: string,
    attrs: WMLDOMAttrs = {},
    children: Node[] = []): Node => {

    if (!isBrowser) {

        return new WMLDOMElement(name, escapeAttrs(attrs), children);

    } else {

        let e = document.createElement(tag);

        forEach(attrs, (value, key) => {

            if (typeof value === 'function') {

                (<Type>e)[key] = value;

            } else if (typeof value === 'string') {

                //prevent setting things like disabled=''
                if (value !== '')
                    e.setAttribute(key, value);

            } else if (typeof value === 'boolean') {

                e.setAttribute(key, '');

            }

        });

        children.forEach(c => {

            switch (typeof c) {

                case 'string':
                case 'number':
                case 'boolean':
                    e.appendChild(<Node>document.createTextNode('' + c));
                case 'object':
                    e.appendChild(<Node>c);
                    break;
                default:
                    throw new TypeError(
                        `Can not adopt child ${c} of type ${typeof c}`
                    );

            }

        });

        return e;

    }

}
