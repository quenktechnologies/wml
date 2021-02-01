"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElement = exports.createTextNode = exports.escapeHTML = exports.escapeAttrValue = exports.escapeAttrs = exports.WMLDOMElement = exports.WMLDOMText = exports.WMLDOMNode = exports.WMLNodeList = void 0;
var record_1 = require("@quenk/noni/lib/data/record");
var type_1 = require("@quenk/noni/lib/data/type");
/**
 * This module provides functions used in templates to generate supported DOM
 * nodes.
 *
 * The idea here is to provide an abstraction over DOM construction so
 * we can detect whether we are in a browser or elsewhere and adjust to
 * suite.
 */
var ATTRS_ESC_REGEX = /[><&\u2028\u2029]/g;
var HTML_ESC_REGEX = /["'&<>]/;
var ATTR_ESC_MAP = {
    '&': '\\u0026',
    '>': '\\u003e',
    '<': '\\u003c',
    '"': '\\u0022',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};
var HTML_ENT_MAP = {
    '"': '&quot;',
    '&': '&amp;',
    '\'': '&#x27;',
    '<': '&lt;',
    '>': '&gt;'
};
var voidElements = [
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
var WMLNodeList = /** @class */ (function () {
    function WMLNodeList() {
        this.length = 0;
    }
    WMLNodeList.prototype.item = function () {
        return null;
    };
    WMLNodeList.prototype.forEach = function () { };
    return WMLNodeList;
}());
exports.WMLNodeList = WMLNodeList;
/**
 * WMLDOMNode implements the properties and methods of the DOM Node interface to
 * allow a fake DOM to be built in server side code.
 *
 * Most of the methods and properties cannot be relied on and should not be
 * used.
 */
var WMLDOMNode = /** @class */ (function () {
    function WMLDOMNode(nodeName, nodeType) {
        this.nodeName = nodeName;
        this.nodeType = nodeType;
        this.ATTRIBUTE_NODE = Node.ATTRIBUTE_NODE;
        this.CDATA_SECTION_NODE = Node.CDATA_SECTION_NODE;
        this.COMMENT_NODE = Node.COMMENT_NODE;
        this.DOCUMENT_FRAGMENT_NODE = Node.DOCUMENT_FRAGMENT_NODE;
        this.DOCUMENT_NODE = Node.DOCUMENT_NODE;
        this.DOCUMENT_POSITION_CONTAINED_BY = Node.DOCUMENT_POSITION_CONTAINED_BY;
        this.DOCUMENT_POSITION_CONTAINS = Node.DOCUMENT_POSITION_CONTAINS;
        this.DOCUMENT_POSITION_DISCONNECTED = Node.DOCUMENT_POSITION_DISCONNECTED;
        this.DOCUMENT_POSITION_FOLLOWING = Node.DOCUMENT_POSITION_FOLLOWING;
        this.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
        this.DOCUMENT_POSITION_PRECEDING = Node.DOCUMENT_POSITION_PRECEDING;
        this.DOCUMENT_TYPE_NODE = Node.DOCUMENT_TYPE_NODE;
        this.ELEMENT_NODE = Node.ELEMENT_NODE;
        this.ENTITY_NODE = Node.ENTITY_NODE;
        this.ENTITY_REFERENCE_NODE = Node.ENTITY_REFERENCE_NODE;
        this.NOTATION_NODE = Node.NOTATION_NODE;
        this.PROCESSING_INSTRUCTION_NODE = Node.PROCESSING_INSTRUCTION_NODE;
        this.TEXT_NODE = Node.TEXT_NODE;
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
        this.textContent = null;
    }
    WMLDOMNode.prototype.addEventListener = function () { };
    WMLDOMNode.prototype.dispatchEvent = function () {
        return false;
    };
    WMLDOMNode.prototype.removeEventListener = function () { };
    WMLDOMNode.prototype.appendChild = function (newChild) {
        return newChild;
    };
    WMLDOMNode.prototype.cloneNode = function () {
        return this;
    };
    WMLDOMNode.prototype.compareDocumentPosition = function () {
        return 0;
    };
    WMLDOMNode.prototype.contains = function () {
        return false;
    };
    WMLDOMNode.prototype.getRootNode = function () {
        return this;
    };
    WMLDOMNode.prototype.hasChildNodes = function () {
        return false;
    };
    WMLDOMNode.prototype.insertBefore = function (newChild) {
        return newChild;
    };
    WMLDOMNode.prototype.isDefaultNamespace = function () {
        return false;
    };
    WMLDOMNode.prototype.isEqualNode = function () {
        return false;
    };
    WMLDOMNode.prototype.isSameNode = function () {
        return false;
    };
    WMLDOMNode.prototype.lookupNamespaceURI = function () {
        return null;
    };
    WMLDOMNode.prototype.lookupPrefix = function () {
        return null;
    };
    WMLDOMNode.prototype.normalize = function () { };
    WMLDOMNode.prototype.remove = function () { };
    WMLDOMNode.prototype.before = function () { };
    WMLDOMNode.prototype.after = function () { };
    WMLDOMNode.prototype.replaceWith = function () { };
    WMLDOMNode.prototype.removeChild = function (oldChild) {
        return oldChild;
    };
    WMLDOMNode.prototype.replaceChild = function (_, oldChild) {
        return oldChild;
    };
    return WMLDOMNode;
}());
exports.WMLDOMNode = WMLDOMNode;
/**
 * WMLDOMText is used to represent Text nodes on the server side.
 * @private
 */
var WMLDOMText = /** @class */ (function (_super) {
    __extends(WMLDOMText, _super);
    function WMLDOMText(value) {
        var _this = _super.call(this, '#text', Node.TEXT_NODE) || this;
        _this.value = value;
        return _this;
    }
    WMLDOMText.prototype.renderToString = function () {
        return exports.escapeHTML(this.value);
    };
    return WMLDOMText;
}(WMLDOMNode));
exports.WMLDOMText = WMLDOMText;
/**
 * WMLDOMElement is used to represent Element nodes on the server side.
 * @private
 */
var WMLDOMElement = /** @class */ (function (_super) {
    __extends(WMLDOMElement, _super);
    function WMLDOMElement(tag, attrs, children) {
        if (children === void 0) { children = []; }
        var _this = _super.call(this, tag, Node.ELEMENT_NODE) || this;
        _this.tag = tag;
        _this.attrs = attrs;
        _this.children = children;
        return _this;
    }
    Object.defineProperty(WMLDOMElement.prototype, "innerHTML", {
        get: function () {
            return this.children.map(function (c) {
                switch (c.nodeType) {
                    case Node.TEXT_NODE:
                        return c.textContent;
                    case Node.ELEMENT_NODE:
                        return c.outerHTML;
                    default:
                        return '';
                }
            }).join('');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WMLDOMElement.prototype, "outerHTML", {
        get: function () {
            var tag = this.tag;
            var content = this.innerHTML;
            var attrs = record_1.mapTo(this.attrs, function (value, name) { return !value ?
                name : name + "=\"" + exports.escapeAttrValue('' + value) + "\""; }).join(' ');
            var open = "<" + tag + " " + attrs + ">";
            return (voidElements.indexOf(tag) > -1) ?
                open : "<" + open + ">" + content + "</" + tag + ">";
        },
        enumerable: false,
        configurable: true
    });
    return WMLDOMElement;
}(WMLDOMNode));
exports.WMLDOMElement = WMLDOMElement;
var isBrowser = ((window != null) && (document != null));
/**
 * escapeAttrs escapes each key value pair of a WMLDOMAttrs.
 */
exports.escapeAttrs = function (attrs) {
    return record_1.map(attrs, function (value) { return type_1.isString(value) ? exports.escapeAttrValue(value) : value; });
};
/**
 * escapeAttrValue for safe browser display.
 */
exports.escapeAttrValue = function (value) {
    return value.replace(ATTRS_ESC_REGEX, function (hit) { return ATTR_ESC_MAP[hit]; });
};
/**
 * escapeHTML for safe browser display.
 */
exports.escapeHTML = function (value) {
    return value.replace(HTML_ESC_REGEX, function (hit) { return HTML_ENT_MAP[hit]; });
};
/**
 * createTextNode wrapper.
 */
exports.createTextNode = function (txt) { return isBrowser ?
    document.createTextNode(txt) : new WMLDOMText(exports.escapeHTML(txt)); };
/**
 * createElement wrapper.
 */
exports.createElement = function (tag, attrs, children) {
    if (attrs === void 0) { attrs = {}; }
    if (children === void 0) { children = []; }
    if (!isBrowser) {
        return new WMLDOMElement(name, exports.escapeAttrs(attrs), children);
    }
    else {
        var e_1 = document.createElement(tag);
        record_1.forEach(attrs, function (value, key) {
            if (typeof value === 'function') {
                e_1[key] = value;
            }
            else if (typeof value === 'string') {
                //prevent setting things like disabled=''
                if (value !== '')
                    e_1.setAttribute(key, value);
            }
            else if (typeof value === 'boolean') {
                e_1.setAttribute(key, '');
            }
        });
        children.forEach(function (c) {
            switch (typeof c) {
                case 'string':
                case 'number':
                case 'boolean':
                    e_1.appendChild(document.createTextNode('' + c));
                case 'object':
                    e_1.appendChild(c);
                    break;
                default:
                    throw new TypeError("Can not adopt child " + c + " of type " + typeof c);
            }
        });
        return e_1;
    }
};
//# sourceMappingURL=dom.js.map