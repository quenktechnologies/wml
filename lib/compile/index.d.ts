import { Except } from '@quenk/noni/lib/control/error';
import { CodeGeneratorOptions } from './codegen';
/**
 * TypeScript output.
 */
export declare type TypeScript = string;
/**
 * Options for changing the behaviour of compilation.
 */
export interface Options extends Partial<CodeGeneratorOptions> {
    debug?: boolean;
    main?: string;
}
/**
 * compile a string of WML text directly into typescript.
 */
export declare const compile: (src: string, opts?: Options) => Except<string>;
