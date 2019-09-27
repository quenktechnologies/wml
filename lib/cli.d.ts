import { Future } from '@quenk/noni/lib/control/monad/future';
import { Options } from './compile/target/dom';
/**
 * Arguments passed on the command line.
 */
export interface Arguments {
    '--main': string;
    '--extension': string;
    '--inputExtension': string;
    '--module': string;
    '<path>': string;
}
/**
 * execute the program.
 */
export declare const execute: (cwd: string, args: Arguments) => Future<void> | Future<void[]>;
/**
 * compileDir will compile each wml file found in the specified path.
 */
export declare const compileDir: (path: string, opts: Options) => Future<void[]>;
/**
 * compileFile will compile a single file but only if its extension
 * is the target extension.
 */
export declare const compileFile: (path: string, opts: Options) => Future<void>;
