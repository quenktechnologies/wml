"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformTree = exports.rewriteViewStatementContext = void 0;
const ast = require("../parse/ast");
/**
 * rewriteViewContext normalizes the various forms of the context declaration
 * in a view statement.
 *
 * WHERE clauses are turned into context declarations with id <view-type>Context,
 * imports are included in the module's import list.
 */
const rewriteViewStatementContext = (tree, node) => {
    if (Array.isArray(node.context)) {
        // TODO: Is this branch still needed?
        let contextName = `${node.id.value}Context`;
        let context = new ast.ContextStatement(new ast.UnqualifiedIdentifier(contextName, node.id.location), node.typeParameters, node.context, node.location);
        let consType = new ast.ConstructorType(context.id, context.typeParameters, context.location);
        let view = new ast.ViewStatement(node.id, node.typeParameters, consType, node.directives, node.root, node.location);
        return [context, view];
    }
    else if (node.context instanceof ast.ContextFromStatement) {
        let { context } = node;
        let { location } = context;
        tree.imports.push(new ast.ImportStatement(new ast.CompositeMember([
            context.cons.id
        ], location), context.module, location));
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
const transformTree = (tree) => {
    let newTree = tree.clone(); // Try not to modify what we don't own.
    newTree.exports = tree.exports.reduce((prev, curr) => (curr instanceof ast.ViewStatement) ?
        [...prev, ...(0, exports.rewriteViewStatementContext)(newTree, curr)] :
        [...prev, curr], []);
    return newTree;
};
exports.transformTree = transformTree;
//# sourceMappingURL=transform.js.map