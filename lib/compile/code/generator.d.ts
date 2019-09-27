import * as ast from '../../parse/ast';
import { Code, Context } from './';
/**
 * Generator allows the compilation process to delegate generation
 * of some of the more target environment sensitive code to a configurable
 * class.
 */
export interface Generator {
    /**
     * imports to insert into the output
     */
    imports(ctx: Context): Code;
    /**
     * definitions to insert into the output
     */
    definitions(ctx: Context): Code;
    /**
     * view definition generator
     */
    view(ctx: Context, v: ast.ViewStatement): Code;
    /**
     * fun definition generator
     */
    fun(ctx: Context, f: ast.FunStatement): Code;
    /**
     * widget construction generator.
     */
    widget(ctx: Context, w: ast.Widget): Code;
    /**
     * node (DOM) generator.
     */
    node(ctx: Context, n: ast.Node): Code;
    /**
     * ifelse statement generator.
     */
    ifelse(ctx: Context, n: ast.IfStatement): Code;
    /**
     * forIn statement generator.
     */
    forIn(ctx: Context, n: ast.ForInStatement): Code;
    /**
     * forOf statement generator.
     */
    forOf(ctx: Context, n: ast.ForOfStatement): Code;
    /**
     * text node generator.
     *
     * NOTE: In a DOM envrionment this ensures output is a text node.
     * In other environments escaping may be necessary.
     */
    text(ctx: Context, str: string): Code;
}
