import * as ast from '../parse/ast';
/**
 * rewriteViewContext turns the "where" clause of view statements into their
 * own context declaration.
 *
 * A context declaration with id <view-name>Context will be generated and the
 * ViewStatement's context property updated.
 */
export declare const rewriteViewStatementContext: (node: ast.ViewStatement) => ast.Export[];
/**
 * transformTree applies all the needed transforms to the AST before
 * compilation.
 */
export declare const transformTree: (tree: ast.Module) => ast.Module;
