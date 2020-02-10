import * as os from 'os';

import { merge } from '@quenk/noni/lib/data/record';
import { Except } from '@quenk/noni/lib/control/error';

import { parse } from '../parse';
import { CodeGenerator, CodeGeneratorOptions } from './codegen';

/**
 * TypeScript output.
 */
export type TypeScript = string;

/**
 * Options for changing the behaviour of compilation.
 */
export interface Options extends Partial<CodeGeneratorOptions> {

    debug?: boolean,

    main?: string,

}

const defaultOptions = {

    module: '@quenk/wml',

    dom: '@quenk/wml/lib/dom',

    EOL: os.EOL

}

/**
 * compile a string of WML text directly into typescript.
 */
export const compile = (src: string, opts: Options = {}): Except<string> =>
    parse(src).map(m =>
        CodeGenerator.create(merge(defaultOptions, opts)).generate(m));
