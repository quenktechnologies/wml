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
 * rewriteViewContext normalizes the various forms of the context declaration
 * in a view statement.
 *
 * WHERE clauses are turned into context declarations with id <view-type>Context,
 * imports are included in the module's import list.
 */
var rewriteViewStatementContext = function (tree, node) {
    if (Array.isArray(node.context)) {
        // TODO: Is this branch still needed?
        var contextName = "".concat(node.id.value, "Context");
        var context = new ast.ContextStatement(new ast.UnqualifiedIdentifier(contextName, node.id.location), node.typeParameters, node.context, node.location);
        var consType = new ast.ConstructorType(context.id, context.typeParameters, context.location);
        var view = new ast.ViewStatement(node.id, node.typeParameters, consType, node.directives, node.root, node.location);
        return [context, view];
    }
    else if (node.context instanceof ast.ContextFromStatement) {
        var context = node.context;
        var location_1 = context.location;
        tree.imports.push(new ast.ImportStatement(new ast.CompositeMember([
            context.cons.id
        ], location_1), context.module, location_1));
        return [
            new ast.ViewStatement(node.id, node.typeParameters, context.cons, node.directives, node.root, node.location)
        ];
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
var transformTree = function (tree) {
    var newTree = tree.clone(); // Try not to modify what we don't own.
    newTree.exports = tree.exports.reduce(function (prev, curr) {
        return (curr instanceof ast.ViewStatement) ? __spreadArray(__spreadArray([], prev, true), (0, exports.rewriteViewStatementContext)(newTree, curr), true) : __spreadArray(__spreadArray([], prev, true), [curr], false);
    }, []);
    return newTree;
};
exports.transformTree = transformTree;
//# sourceMappingURL=transform.js.map