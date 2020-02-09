import { Generator } from './generator';

/**
 * Code output.
 */
export type Code = string;

/**
 * Options
 */
export interface Options {

    main?: string,

    module?: string,

    dom?: string,

    EOL: '\n'

}

/**
 * Context compilation takes place in.
 */
export interface Context {

    /**
     * options
     */
    options: Options,

    /**
     * generator configured for the context.
     */
    generator: Generator

}
