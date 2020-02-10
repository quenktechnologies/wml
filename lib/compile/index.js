"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var record_1 = require("@quenk/noni/lib/data/record");
var parse_1 = require("../parse");
var codegen_1 = require("./codegen");
var defaultOptions = {
    module: '@quenk/wml',
    dom: '@quenk/wml/lib/dom',
    EOL: os.EOL
};
/**
 * compile a string of WML text directly into typescript.
 */
exports.compile = function (src, opts) {
    if (opts === void 0) { opts = {}; }
    return parse_1.parse(src).map(function (m) {
        return codegen_1.CodeGenerator.create(record_1.merge(defaultOptions, opts)).generate(m);
    });
};
//# sourceMappingURL=index.js.map