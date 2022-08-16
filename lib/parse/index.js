"use strict";
/// <reference path='generated.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const parser = require("./generated");
const nodes = require("./ast");
const error_1 = require("@quenk/noni/lib/control/error");
/**
 * parse a string containing WML returning the resulting AST.
 */
const parse = (str, ast = nodes) => (0, error_1.attempt)(() => {
    parser.parser.yy = { ast };
    return parser.parser.parse(str);
});
exports.parse = parse;
//# sourceMappingURL=index.js.map