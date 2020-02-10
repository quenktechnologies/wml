import { Content } from './';

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
    renderToString(): string

}

/**
 * SSRText is used to represent Text nodes on the server side.
 */
export class SSRText implements SSRNode {

    constructor(public value: string) { }

    renderToString(): string {

        return escapeHTML(this.value);

    }

}

/**
 * SSRElement is used to represent Element nodes on the server side.
 */
export class SSRElement {

    constructor(public name: string) { }

    attrs: string[] = [];

    children: SSRNode[] = [];

    setAttribute(key: string, value: string) {

        let newKey = escapeAttrValue(key);

        this.attrs.push((value === '') ? newKey :
            `${newKey}="${escapeAttrValue(value)}"`);

    }

    appendChild(node: Content) {

        this.children.push(<SSRNode>node);

    }

    renderToString(): string {

        let { name } = this;
        let childs = this.children.map(c => c.renderToString()).join('');
        let attrs = this.attrs.join(' ');

        return `<${name} ${attrs}>${childs}</${name}>`;

    }

}

const isBrowser = ((window != null) && (document != null));

const escapeAttrValue = (value: string) =>
    value.replace(ATTRS_ESC_REGEX, hit => ATTR_ESC_MAP[hit]);

const escapeHTML = (value: string) =>
    value.replace(HTML_ESC_REGEX, hit => HTML_ENT_MAP[hit]);

/**
 * createTextNode wrapper.
 */
export const createTextNode = (txt: string): Text | SSRText => isBrowser ?
    document.createTextNode(txt) : new SSRText(txt);

/**
 * createElement wrapper.
 */
export const createElement = (name: string): Element | SSRElement =>
    isBrowser ? document.createElement(name) : new SSRElement(name);
