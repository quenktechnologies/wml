"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformTree = exports.tagXMLNamespaces = exports.rewriteViewStatementContext = void 0;
const ast = require("../parse/ast");
/**
 * rewriteViewContext normalizes the various forms of the context declaration
 * in a view statement.
 *
 * "where" clauses are turned into context declarations with id
 * <view-type>Context, imports are included in the module's import list.
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
 * tagXMLNamespaces detects the "xmlns" attribute on DOM nodes and copies them
 * to the `wml:ns` attribute recursively.
 *
 * This has the effect of ensuring nodes are created using createElementNS()
 * instead of createElement in the browser.
 */
const tagXMLNamespaces = (tag, parentAttr) => {
    let attr = (tag.attributes.find(attr => (attr.namespace.value == '') && (attr.name.value === 'xmlns'))) ||
        parentAttr;
    if (attr) {
        tag.attributes.push(new ast.Attribute(new ast.UnqualifiedIdentifier('wml', attr.location), new ast.UnqualifiedIdentifier('ns', attr.location), attr.value, attr.location));
    }
    tag.children = tag.children.map(child => ((child instanceof ast.Node) || (child instanceof ast.Widget)) ?
        (0, exports.tagXMLNamespaces)(child, attr) : child);
    return tag;
};
exports.tagXMLNamespaces = tagXMLNamespaces;
/**
 * transformTree applies all the needed transforms to the AST before
 * compilation.
 */
const transformTree = (tree) => {
    let newTree = tree.clone(); // Try not to modify what we don't own.
    newTree.exports = tree.exports.reduce((prev, next) => {
        if (next instanceof ast.ViewStatement) {
            next.root = (0, exports.tagXMLNamespaces)(next.root);
            return [...prev, ...(0, exports.rewriteViewStatementContext)(newTree, next)];
        }
        else {
            return [...prev, next];
        }
    }, []);
    return newTree;
};
exports.transformTree = transformTree;
//# sourceMappingURL=transform.js.map