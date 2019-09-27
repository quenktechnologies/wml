"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var ts = require("./output");
var parse_1 = require("../../../parse");
var generator_1 = require("./generator");
/**
 * compile a string of WML into typescript code.
 */
exports.compile = function (src, opts) {
    if (opts === void 0) { opts = {}; }
    return parse_1.parse(src).map(function (m) { return ts.module2TS(newContext(opts), m); });
};
var newContext = function (opts) {
    var options = opts;
    opts.EOL = os.EOL;
    return { options: options, generator: new generator_1.DOMGenerator() };
};
//# sourceMappingURL=index.js.map