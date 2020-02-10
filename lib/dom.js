"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
/**
 * SSRText is used to represent Text nodes on the server side.
 */
var SSRText = /** @class */ (function () {
    function SSRText(value) {
        this.value = value;
    }
    SSRText.prototype.renderToString = function () {
        return escapeHTML(this.value);
    };
    return SSRText;
}());
exports.SSRText = SSRText;
/**
 * SSRElement is used to represent Element nodes on the server side.
 */
var SSRElement = /** @class */ (function () {
    function SSRElement(name) {
        this.name = name;
        this.attrs = [];
        this.children = [];
    }
    SSRElement.prototype.setAttribute = function (key, value) {
        var newKey = escapeAttrValue(key);
        this.attrs.push((value === '') ? newKey :
            newKey + "=\"" + escapeAttrValue(value) + "\"");
    };
    SSRElement.prototype.appendChild = function (node) {
        this.children.push(node);
    };
    SSRElement.prototype.renderToString = function () {
        var name = this.name;
        var childs = this.children.map(function (c) { return c.renderToString(); }).join('');
        var attrs = this.attrs.join(' ');
        return "<" + name + " " + attrs + ">" + childs + "</" + name + ">";
    };
    return SSRElement;
}());
exports.SSRElement = SSRElement;
var isBrowser = ((window != null) && (document != null));
var escapeAttrValue = function (value) {
    return value.replace(ATTRS_ESC_REGEX, function (hit) { return ATTR_ESC_MAP[hit]; });
};
var escapeHTML = function (value) {
    return value.replace(HTML_ESC_REGEX, function (hit) { return HTML_ENT_MAP[hit]; });
};
/**
 * createTextNode wrapper.
 */
exports.createTextNode = function (txt) { return isBrowser ?
    document.createTextNode(txt) : new SSRText(txt); };
/**
 * createElement wrapper.
 */
exports.createElement = function (name) {
    return isBrowser ? document.createElement(name) : new SSRElement(name);
};
//# sourceMappingURL=dom.js.map