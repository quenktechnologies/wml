import { Generator } from './generator';
/**
 * Code output.
 */
export declare type Code = string;
/**
 * Options
 */
export interface Options {
    main?: string;
    module?: string;
    EOL: '\n';
}
/**
 * Context compilation takes place in.
 */
export interface Context {
    /**
     * options
     */
    options: Options;
    /**
     * generator configured for the context.
     */
    generator: Generator;
}
