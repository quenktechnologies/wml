import * as ast from '../../../parse/ast';
import { Generator } from '../../code/generator';
import { Context } from '../../code';
/**
 * DOMGenerator targets the client side DOM.
 */
export declare class DOMGenerator implements Generator {
    imports(ctx: Context): string;
    definitions(ctx: Context): string;
    view(ctx: Context, n: ast.ViewStatement): string;
    fun(ctx: Context, n: ast.FunStatement): string;
    widget(ctx: Context, w: ast.Widget): string;
    node(ctx: Context, n: ast.Node): string;
    ifelse(ctx: Context, n: ast.IfStatement): string;
    forIn(ctx: Context, n: ast.ForInStatement): string;
    forOf(ctx: Context, n: ast.ForOfStatement): string;
    text(_: Context, str: string): string;
}
