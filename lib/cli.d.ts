import { Future } from '@quenk/noni/lib/control/monad/future';
import { Options } from './compile';
/**
 * CLIOptions
 */
export interface CLIOptions extends Partial<Options> {
    /**
     * inputExtension is the file extension used when searching for files to
     * compile.
     */
    inputExtension: string;
    /**
     * outputExtension is the file extension used when outputing directly to file.
     */
    outputExtension: string;
}
/**
 * Arguments passed on the command line.
 */
export interface Arguments {
    '--main': string;
    '--outputExtension': string;
    '--inputExtension': string;
    '--module': string;
    '--dom': string;
    '<path>': string;
}
/**
 * compileDir will compile each wml file found in the specified path.
 */
export declare const compileDir: (path: string, opts: CLIOptions) => Future<void[]>;
/**
 * compileFile will compile a single wml file.
 *
 * If that file does not have the specified inputExtension, it will be
 * ignored.
 */
export declare const compileFile: (path: string, opts: CLIOptions) => Future<void>;
