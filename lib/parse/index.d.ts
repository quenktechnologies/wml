/// <reference path="generated.d.ts" />
import * as nodes from './ast';
import { Except } from '@quenk/noni/lib/control/error';
/**
 * parse a string containing WML returning the resulting AST.
 */
export declare const parse: (str: string, ast?: any) => Except<nodes.Module>;
