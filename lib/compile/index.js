"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const os = require("os");
const record_1 = require("@quenk/noni/lib/data/record");
const parse_1 = require("../parse");
const codegen_1 = require("./codegen");
const defaultOptions = {
    module: '@quenk/wml',
    dom: '@quenk/wml/lib/dom',
    EOL: os.EOL
};
/**
 * compile a string of WML text directly into typescript.
 */
const compile = (src, opts = {}) => (0, parse_1.parse)(src).map(m => codegen_1.CodeGenerator.create((0, record_1.merge)(defaultOptions, opts)).generate(m));
exports.compile = compile;
//# sourceMappingURL=index.js.map