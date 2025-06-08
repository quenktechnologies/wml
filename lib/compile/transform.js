"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformTree = exports.tagSVGNodes = exports.TAG_NAME_SVG = exports.rewriteViewStatementContext = void 0;
const ast = require("../parse/ast");
const codegen_1 = require("./codegen");
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
exports.TAG_NAME_SVG = 'svg';
/**
 * tagSVGNodes traverses the tree to detect any embedded svg.
 *
 * If an svg parent tag is found, it and all its children will receive a
 * wml:ns=svg attribute. This will cause the runtime to use createElementNS()
 * instead of createElement, allowing the svg document to be treated as SVG
 * and not HTML DOM.
 */
const tagSVGNodes = (tag) => {
    let pending = [[false, [tag]]];
    while (pending.length) {
        let [isSvg, stack] = pending.pop();
        while (stack.length) {
            let next = stack.pop();
            if ((next instanceof ast.Node) &&
                ((0, codegen_1.identifierOrConstructor2TS)(next.open)
                    === exports.TAG_NAME_SVG) &&
                !isSvg) {
                pending.push([true, [next]]);
                break;
            }
            let childrens = [];
            if (next instanceof ast.Node) {
                if (isSvg)
                    next.attributes.push(new ast.Attribute(new ast.UnqualifiedIdentifier('wml', {}), new ast.UnqualifiedIdentifier('ns', {}), new ast.StringLiteral('svg', {}), {}));
                childrens.push(next.children);
            }
            else if ((next instanceof ast.Widget) || (next instanceof ast.ElseClause)) {
                childrens.push(next.children);
            }
            else if (next instanceof ast.ForOfStatement) {
                childrens.push(next.body, next.otherwise);
            }
            else if ((next instanceof ast.IfStatement) || (next instanceof ast.ElseIfClause)) {
                childrens.push(next.then);
                if (next.elseClause)
                    childrens.push([next.elseClause]);
            }
            for (let children of childrens)
                for (let child of children)
                    stack.push(child);
        }
    }
    return tag;
};
exports.tagSVGNodes = tagSVGNodes;
/**
 * transformTree applies all the needed transforms to the AST before
 * compilation.
 */
const transformTree = (tree) => {
    let newTree = tree.clone(); // Try not to modify what we don't own.
    newTree.exports = tree.exports.reduce((prev, next) => {
        if (next instanceof ast.ViewStatement) {
            next.root = (0, exports.tagSVGNodes)(next.root);
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