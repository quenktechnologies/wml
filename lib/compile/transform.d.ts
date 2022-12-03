import * as ast from '../parse/ast';
/**
 * rewriteViewContext normalizes the various forms of the context declaration
 * in a view statement.
 *
 * "where" clauses are turned into context declarations with id
 * <view-type>Context, imports are included in the module's import list.
 */
export declare const rewriteViewStatementContext: (tree: ast.Module, node: ast.ViewStatement) => ast.Export[];
/**
 * tagXMLNamespaces detects the "xmlns" attribute on DOM nodes and copies them
 * to the `wml:ns` attribute recursively.
 *
 * This has the effect of ensuring nodes are created using createElementNS()
 * instead of createElement in the browser.
 */
export declare const tagXMLNamespaces: (tag: ast.Tag | ast.Widget, parentAttr?: ast.Attribute) => ast.Tag;
/**
 * transformTree applies all the needed transforms to the AST before
 * compilation.
 */
export declare const transformTree: (tree: ast.Module) => ast.Module;
