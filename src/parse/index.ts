/// <reference path='generated.d.ts' />

import * as parser from "./generated";
import * as nodes from "./ast";

import { Except, attempt } from "@quenk/noni/lib/control/error";

/**
 * parse a string containing WML returning the resulting AST.
 */
export const parse = (str: string, ast: any = nodes): Except<nodes.Module> =>
  attempt(() => {
    parser.parser.yy = { ast };

    return parser.parser.parse(str);
  });
