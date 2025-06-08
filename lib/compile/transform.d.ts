import * as ast from '../parse/ast';
/**
 * rewriteViewContext normalizes the various forms of the context declaration
 * in a view statement.
 *
 * "where" clauses are turned into context declarations with id
 * <view-type>Context, imports are included in the module's import list.
 */
export declare const rewriteViewStatementContext: (tree: ast.Module, node: ast.ViewStatement) => ast.Export[];
export declare const TAG_NAME_SVG = "svg";
/**
 * tagSVGNodes traverses the tree to detect any embedded svg.
 *
 * If an svg parent tag is found, it and all its children will receive a
 * wml:ns=svg attribute. This will cause the runtime to use createElementNS()
 * instead of createElement, allowing the svg document to be treated as SVG
 * and not HTML DOM.
 */
export declare const tagSVGNodes: (tag: ast.Tag) => ast.Tag;
/**
 * transformTree applies all the needed transforms to the AST before
 * compilation.
 */
export declare const transformTree: (tree: ast.Module) => ast.Module;
