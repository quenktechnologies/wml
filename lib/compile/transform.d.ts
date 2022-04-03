import * as ast from '../parse/ast';
/**
 * rewriteViewContext normalizes the various forms of the context declaration
 * in a view statement.
 *
 * WHERE clauses are turned into context declarations with id <view-type>Context,
 * imports are included in the module's import list.
 */
export declare const rewriteViewStatementContext: (tree: ast.Module, node: ast.ViewStatement) => ast.Export[];
/**
 * transformTree applies all the needed transforms to the AST before
 * compilation.
 */
export declare const transformTree: (tree: ast.Module) => ast.Module;
