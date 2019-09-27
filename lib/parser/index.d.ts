/// <reference path="generated.d.ts" />
import * as nodes from './ast';
/**
 * parse a string containing WML returning the resulting AST.
 */
export declare const parse: (str: string, ast?: any) => import("@quenk/noni/lib/data/either").Either<import("@quenk/noni/lib/control/error").Err, nodes.Module>;
