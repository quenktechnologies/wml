/**
 * This module provides functions used in templates to generate supported DOM
 * nodes.
 *
 * The idea here is to provide an abstraction over DOM construction so
 * we can detect whether we are in a browser or elsewhere and adjust to
 * suite.
 */

import { Record, mapTo, forEach } from "@quenk/noni/lib/data/record";
import { Type, isFunction, isObject } from "@quenk/noni/lib/data/type";

const DOCTYPE = "<!DOCTYPE html>";

const ATTR_ESC_MAP: { [key: string]: string } = {
  "&": "\\u0026",

  ">": "\\u003e",

  "<": "\\u003c",

  '"': "\\u0022",

  "=": "\\u003d",

  "\u005c": "\\u005c",

  "\u2028": "\\u2028",

  "\u2029": "\\u2029",
};

const attrsEscRegex = new RegExp(`[${mapTo(ATTR_ESC_MAP, (_, k) => k)}]`, "g");

const HTML_ENT_MAP: { [key: string]: string } = {
  '"': "&quot;",

  "&": "&amp;",

  "'": "&apos;",

  "<": "&lt;",

  ">": "&gt;",
};

const htmlEscRegex = new RegExp(
  `[${mapTo(HTML_ENT_MAP, (_, k) => k).join("")}]`,
  "g",
);

const voidElements = [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];

/**
 * WMLDOMAttrs is a record of attributes bound for a WMLDOMElement.
 */
export interface WMLDOMAttrs extends Record<string | number | Function> {}

/**
 * WMLNodeList implementation.
 * @private
 */
export class WMLNodeList implements NodeListOf<WMLDOMNode> {
  entries(): ArrayIterator<[number, WMLDOMNode]> {
    throw new Error("Method not implemented.");
  }
  keys(): ArrayIterator<number> {
    throw new Error("Method not implemented.");
  }
  values(): ArrayIterator<WMLDOMNode> {
    throw new Error("Method not implemented.");
  }
  [Symbol.iterator](): ArrayIterator<WMLDOMNode> {
    throw new Error("Method not implemented.");
  }
  [Symbol.dispose]() {
    throw new Error("Method not implemented.");
  }

  [index: number]: WMLDOMNode;

  length = 0;

  item() {
    return <WMLDOMNode>(<Type>null);
  }

  forEach() {}
}

/**
 * WMLDOMNode implements the properties and methods of the DOM Node interface to
 * allow a fake DOM to be built in server side code.
 *
 * Most of the methods and properties cannot be relied on and should not be
 * used.
 */
export class WMLDOMNode implements Node {
  constructor(
    public nodeName: string,
    public nodeType: number,
  ) {}

  readonly ATTRIBUTE_NODE = 2;

  readonly CDATA_SECTION_NODE = 4;

  readonly COMMENT_NODE = 8;

  readonly DOCUMENT_FRAGMENT_NODE = 11;

  readonly DOCUMENT_NODE = 9;

  readonly DOCUMENT_POSITION_CONTAINED_BY = 16;

  readonly DOCUMENT_POSITION_CONTAINS = 8;

  readonly DOCUMENT_POSITION_DISCONNECTED = 1;

  readonly DOCUMENT_POSITION_FOLLOWING = 4;

  readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;

  readonly DOCUMENT_POSITION_PRECEDING = 2;

  readonly DOCUMENT_TYPE_NODE = 10;

  readonly ELEMENT_NODE = 1;

  readonly ENTITY_NODE = 6;

  readonly ENTITY_REFERENCE_NODE = 5;

  readonly NOTATION_NODE = 12;

  readonly PROCESSING_INSTRUCTION_NODE = 7;

  readonly TEXT_NODE = 3;

  baseURI = "";

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

  get textContent() {
    return "";
  }

  [Symbol.dispose]() {}

  addEventListener() {}

  dispatchEvent() {
    return false;
  }

  removeEventListener() {}

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

  normalize() {}

  remove() {}

  before() {}

  after() {}

  replaceWith() {}

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
  constructor(
    public value: string,
    public escape = true,
  ) {
    super("#text", -1);
  }

  get textContent() {
    return this.escape ? escapeHTML(this.value) : this.value;
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
    public children: Node[] = [],
  ) {
    super(tag, -1);
  }

  get innerHTML(): string {
    return this.children
      .map((c) =>
        c.nodeName === "#text"
          ? (<Text>c).textContent
          : (<HTMLElement>c).outerHTML,
      )
      .join("");
  }

  get outerHTML() {
    let { tag } = this;
    let content = this.innerHTML;

    let attrs = mapTo(this.attrs, (value, name) => {
      if (isObject(value) && value instanceof WMLDOMText)
        return `${name}="${value.textContent}"`;
      else if (isFunction(value) || isObject(value) || value == null) return "";
      else return `${name}="${escapeAttrValue(String(value))}"`;
    }).join(" ");

    attrs = attrs.trim() != "" ? ` ${attrs}` : "";

    let open = `<${tag}${attrs}>`;

    if (tag === "html") open = `${DOCTYPE}${open}`;

    return voidElements.indexOf(tag) > -1 ? open : `${open}${content}</${tag}>`;
  }

  setAttribute(key: string, value: Type) {
    this.attrs[key] = value;
  }

  appendChild<T extends Node>(newChild: T): T {
    this.children.push(newChild);
    return newChild;
  }
}

/**
 * isBrowser is set to true if we detect a window and document global variable.
 */
export const isBrowser =
  typeof window !== "undefined" && typeof window.document !== "undefined";

/**
 * escapeAttrValue for safe browser display.
 */
export const escapeAttrValue = (value: string) =>
  value.replace(attrsEscRegex, (hit) => ATTR_ESC_MAP[hit]);

/**
 * escapeHTML for safe browser display.
 */
export const escapeHTML = (value: string) =>
  value.replace(htmlEscRegex, (hit) => HTML_ENT_MAP[hit]);

/**
 * createTextNode wrapper.
 */
export const createTextNode = (txt: Type): Node => {
  let str = String(txt == null ? "" : txt);
  return isBrowser ? document.createTextNode(str) : new WMLDOMText(str);
};

/**
 * createUnsafeNode allows raw strings to be output without escaping.
 *
 * THIS MUST ONLY BE USED IF YOU ARE 100% SURE THE STRING IS SAFE TO OUTPUT!
 */
export const createUnsafeNode = (txt: Type): Node => {
  let str = String(txt == null ? "" : txt);
  return isBrowser ? createBrowserUnsafeNode(str) : new WMLDOMText(str, false);
};

const createBrowserUnsafeNode = (html: string) => {
  let tmpl = document.createElement("template");
  tmpl.innerHTML = html;
  return tmpl.content;
};

export { createTextNode as text, createUnsafeNode as unsafe };

const namespaces = new Map([["svg", "http://www.w3.org/2000/svg"]]);

/**
 * createElement wrapper.
 */
export const createElement = (
  tag: string,
  attrs: WMLDOMAttrs = {},
  children: Node[] = [],
  ns = "",
): Element => {
  if (!isBrowser) {
    // XXX: The whole Element interface is not implemented but on server
    // side we are only interested in setAttribute.
    return <Element>(<Type>new WMLDOMElement(tag, attrs, children));
  } else {
    let e = ns
      ? document.createElementNS(namespaces.get(ns) ?? "", tag)
      : document.createElement(tag);

    forEach(attrs, (value: Type, key) => {
      if (typeof value === "function") {
        (<Type>e)[key] = value;
      } else if (typeof value === "string") {
        // prevent setting things like disabled=""
        if (value !== "") e.setAttribute(key, value);
      } else if (typeof value === "boolean") {
        e.setAttribute(key, "");
      } else if (!isBrowser && value instanceof WMLDOMText) {
        e.setAttribute(key, <Type>value);
      }
    });

    children.forEach((c) => {
      switch (typeof c) {
        case "string":
        case "number":
        case "boolean":
          e.appendChild(<Node>document.createTextNode("" + c));
        case "object":
          e.appendChild(<Node>c);
          break;
        default:
          throw new TypeError(`Can not adopt child ${c} of type ${typeof c}`);
      }
    });

    return e;
  }
};
