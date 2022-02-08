"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformTree = exports.rewriteViewStatementContext = void 0;
var ast = require("../parse/ast");
/**
 * rewriteViewContext turns the "where" clause of view statements into their
 * own context declaration.
 *
 * A context declaration with id <view-name>Context will be generated and the
 * ViewStatement's context property updated.
 */
var rewriteViewStatementContext = function (node) {
    if (Array.isArray(node.context)) {
        var contextName = "".concat(node.id.value, "Context");
        var context = new ast.ContextStatement(new ast.UnqualifiedIdentifier(contextName, node.id.location), node.typeParameters, node.context, node.location);
        var consType = new ast.ConstructorType(context.id, context.typeParameters, context.location);
        var view = new ast.ViewStatement(node.id, node.typeParameters, consType, node.directives, node.root, node.location);
        return [context, view];
    }
    else {
        return [node];
    }
};
exports.rewriteViewStatementContext = rewriteViewStatementContext;
/**
 * transformTree applies all the needed transforms to the AST before
 * compilation.
 */
var transformTree = function (tree) { return new ast.Module(tree.imports, tree.exports.reduce(function (prev, curr) { return (curr instanceof ast.ViewStatement) ? __spreadArray(__spreadArray([], prev, true), (0, exports.rewriteViewStatementContext)(curr), true) : __spreadArray(__spreadArray([], prev, true), [curr], false); }, []), tree.location); };
exports.transformTree = transformTree;
//# sourceMappingURL=transform.js.map