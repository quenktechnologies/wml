"use strict";
/**
 * This module provides functions used in templates to generate supported DOM
 * nodes.
 *
 * The idea here is to provide an abstraction over DOM construction so
 * we can detect whether we are in a browser or elsewhere and adjust to
 * suite.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElement = exports.unsafe = exports.text = exports.createUnsafeNode = exports.createTextNode = exports.escapeHTML = exports.escapeAttrValue = exports.escapeAttrs = exports.isBrowser = exports.WMLDOMElement = exports.WMLDOMText = exports.WMLDOMNode = exports.WMLNodeList = void 0;
const record_1 = require("@quenk/noni/lib/data/record");
const type_1 = require("@quenk/noni/lib/data/type");
// Declared so isBrowser works on node.js.
let window = global;
let document = global.document;
const DOCTYPE = '<!DOCTYPE html>';
const ATTR_ESC_MAP = {
    '&': '\\u0026',
    '>': '\\u003e',
    '<': '\\u003c',
    '"': '\\u0022',
    '=': '\\u003d',
    '\u005c': '\\u005c',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};
const attrsEscRegex = new RegExp(`[${(0, record_1.mapTo)(ATTR_ESC_MAP, (_, k) => k)}]`, 'g');
const HTML_ENT_MAP = {
    '"': '&quot;',
    '&': '&amp;',
    '\'': '&apos;',
    '<': '&lt;',
    '>': '&gt;'
};
const htmlEscRegex = new RegExp(`[${(0, record_1.mapTo)(HTML_ENT_MAP, (_, k) => k)}]`, 'g');
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
 * WMLNodeList implementation.
 * @private
 */
class WMLNodeList {
    constructor() {
        this.length = 0;
    }
    item() {
        return null;
    }
    forEach() { }
}
exports.WMLNodeList = WMLNodeList;
/**
 * WMLDOMNode implements the properties and methods of the DOM Node interface to
 * allow a fake DOM to be built in server side code.
 *
 * Most of the methods and properties cannot be relied on and should not be
 * used.
 */
class WMLDOMNode {
    constructor(nodeName, nodeType) {
        this.nodeName = nodeName;
        this.nodeType = nodeType;
        this.ATTRIBUTE_NODE = -1;
        this.CDATA_SECTION_NODE = -1;
        this.COMMENT_NODE = -1;
        this.DOCUMENT_FRAGMENT_NODE = -1;
        this.DOCUMENT_NODE = -1;
        this.DOCUMENT_POSITION_CONTAINED_BY = -1;
        this.DOCUMENT_POSITION_CONTAINS = -1;
        this.DOCUMENT_POSITION_DISCONNECTED = -1;
        this.DOCUMENT_POSITION_FOLLOWING = -1;
        this.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = -1;
        this.DOCUMENT_POSITION_PRECEDING = -1;
        this.DOCUMENT_TYPE_NODE = -1;
        this.ELEMENT_NODE = -1;
        this.ENTITY_NODE = -1;
        this.ENTITY_REFERENCE_NODE = -1;
        this.NOTATION_NODE = -1;
        this.PROCESSING_INSTRUCTION_NODE = -1;
        this.TEXT_NODE = -1;
        this.baseURI = '';
        this.childNodes = new WMLNodeList();
        this.firstChild = null;
        this.isConnected = false;
        this.lastChild = null;
        this.namespaceURI = null;
        this.nextSibling = null;
        this.nodeValue = null;
        this.ownerDocument = null;
        this.parentElement = null;
        this.parentNode = null;
        this.previousSibling = null;
    }
    get textContent() {
        return '';
    }
    addEventListener() { }
    dispatchEvent() {
        return false;
    }
    removeEventListener() { }
    appendChild(newChild) {
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
    getRootNode() {
        return this;
    }
    hasChildNodes() {
        return false;
    }
    insertBefore(newChild) {
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
    removeChild(oldChild) {
        return oldChild;
    }
    replaceChild(_, oldChild) {
        return oldChild;
    }
}
exports.WMLDOMNode = WMLDOMNode;
/**
 * WMLDOMText is used to represent Text nodes on the server side.
 * @private
 */
class WMLDOMText extends WMLDOMNode {
    constructor(value, escape = true) {
        super('#text', -1);
        this.value = value;
        this.escape = escape;
    }
    get textContent() {
        return this.escape ? (0, exports.escapeHTML)(this.value) : this.value;
    }
}
exports.WMLDOMText = WMLDOMText;
/**
 * WMLDOMElement is used to represent Element nodes on the server side.
 * @private
 */
class WMLDOMElement extends WMLDOMNode {
    constructor(tag, attrs, children = []) {
        super(tag, -1);
        this.tag = tag;
        this.attrs = attrs;
        this.children = children;
    }
    get innerHTML() {
        return this.children.map(c => (c.nodeName === '#text') ?
            c.textContent :
            c.outerHTML).join('');
    }
    get outerHTML() {
        let { tag } = this;
        let content = this.innerHTML;
        let attrs = (0, record_1.mapTo)((0, exports.escapeAttrs)(this.attrs), (value, name) => !value ?
            name : `${name}="${value}"`).join(' ');
        attrs = (attrs.trim() != '') ? ` ${attrs}` : '';
        let open = `<${tag}${attrs}>`;
        if (tag === "html")
            open = `${DOCTYPE}${open}`;
        return (voidElements.indexOf(tag) > -1) ?
            open : `${open}${content}</${tag}>`;
    }
    setAttribute(key, value) {
        this.attrs[key] = value;
    }
    appendChild(newChild) {
        this.children.push(newChild);
        return newChild;
    }
}
exports.WMLDOMElement = WMLDOMElement;
/**
 * isBrowser is set to true if we detect a window and document global variable.
 */
exports.isBrowser = ((window != null) && (document != null));
/**
 * escapeAttrs escapes each key value pair of a WMLDOMAttrs.
 */
const escapeAttrs = (attrs) => (0, record_1.map)(attrs, value => (0, type_1.isFunction)(value) ? value :
    (value instanceof WMLDOMText) ? value.textContent :
        (0, exports.escapeAttrValue)(String(value)));
exports.escapeAttrs = escapeAttrs;
/**
 * escapeAttrValue for safe browser display.
 */
const escapeAttrValue = (value) => value.replace(attrsEscRegex, hit => ATTR_ESC_MAP[hit]);
exports.escapeAttrValue = escapeAttrValue;
/**
 * escapeHTML for safe browser display.
 */
const escapeHTML = (value) => value.replace(htmlEscRegex, hit => HTML_ENT_MAP[hit]);
exports.escapeHTML = escapeHTML;
/**
 * createTextNode wrapper.
 */
const createTextNode = (txt) => {
    let str = String((txt == null) ? '' : txt);
    return exports.isBrowser ? document.createTextNode(str) : new WMLDOMText(str);
};
exports.createTextNode = createTextNode;
exports.text = exports.createTextNode;
/**
 * createUnsafeNode allows raw strings to be output without escaping.
 *
 * THIS MUST ONLY BE USED IF YOU ARE 100% SURE THE STRING IS SAFE TO OUTPUT!
 */
const createUnsafeNode = (txt) => {
    let str = String((txt == null) ? '' : txt);
    return exports.isBrowser ? createBrowserUnsafeNode(str) : new WMLDOMText(str, false);
};
exports.createUnsafeNode = createUnsafeNode;
exports.unsafe = exports.createUnsafeNode;
const createBrowserUnsafeNode = (html) => {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = html;
    return tmpl.content;
};
/**
 * createElement wrapper.
 */
const createElement = (tag, attrs = {}, children = []) => {
    if (!exports.isBrowser) {
        // XXX: The whole Element interface is not implemented but on server
        // side we are only interested in setAttribute.
        return new WMLDOMElement(tag, attrs, children);
    }
    else {
        let e = document.createElement(tag);
        (0, record_1.forEach)(attrs, (value, key) => {
            if (typeof value === 'function') {
                e[key] = value;
            }
            else if (typeof value === 'string') {
                // prevent setting things like disabled=""
                if (value !== '')
                    e.setAttribute(key, value);
            }
            else if (typeof value === 'boolean') {
                e.setAttribute(key, '');
            }
        });
        children.forEach(c => {
            switch (typeof c) {
                case 'string':
                case 'number':
                case 'boolean':
                    e.appendChild(document.createTextNode('' + c));
                case 'object':
                    e.appendChild(c);
                    break;
                default:
                    throw new TypeError(`Can not adopt child ${c} of type ${typeof c}`);
            }
        });
        return e;
    }
};
exports.createElement = createElement;
//# sourceMappingURL=dom.js.map