"use strict";
/// <reference path='generated.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
var parser = require("./generated");
var nodes = require("./ast");
var error_1 = require("@quenk/noni/lib/control/error");
/**
 * parse a string containing WML returning the resulting AST.
 */
var parse = function (str, ast) {
    if (ast === void 0) { ast = nodes; }
    return (0, error_1.attempt)(function () {
        parser.parser.yy = { ast: ast };
        return parser.parser.parse(str);
    });
};
exports.parse = parse;
//# sourceMappingURL=index.js.map