import { Except } from '@quenk/noni/lib/control/error';
/**
 * OptionValue
 */
export declare type OptionValue = boolean | string | undefined;
/**
 * TypeScript output.
 */
export declare type TypeScript = string;
/**
 * Options the compiler understands.
 */
export interface Options {
    [key: string]: OptionValue;
    debug?: boolean;
    main?: string;
    module?: string;
}
/**
 * compile a string of WML into typescript code.
 */
export declare const compile: (src: string, opts?: Options) => Except<string>;
