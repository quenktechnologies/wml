import { dirname, basename, resolve, extname } from 'path';

import {
    Future,
    pure,
    raise,
    parallel
} from '@quenk/noni/lib/control/monad/future';
import {
    listFilesRec,
    readTextFile,
    writeTextFile
} from '@quenk/noni/lib/io/file';

import { Options, compile } from './compile';

/**
 * CLIOptions
 */
export interface CLIOptions extends Partial<Options> {

    /**
     * inputExtension is the file extension used when searching for files to
     * compile.
     */
    inputExtension: string,

    /**
     * outputExtension is the file extension used when outputing directly to file.
     */
    outputExtension: string

}

/**
 * Arguments passed on the command line.
 */
export interface Arguments {

    '--main': string,

    '--outputExtension': string,

    '--inputExtension': string,

    '--module': string,

    '--dom': string,

    '<path>': string

}

/**
 * compileDir will compile each wml file found in the specified path.
 */
export const compileDir = (path: string, opts: CLIOptions) =>
    listFilesRec(path)
        .map(list =>
            list
                .map(p => resolve(path, p))
                .map(p => compileFile(p, opts)))
        .chain(parallel);

/**
 * compileFile will compile a single wml file.
 *
 * If that file does not have the specified inputExtension, it will be
 * ignored.
 */
export const compileFile = (path: string, opts: CLIOptions)
    : Future<void> => {

    if (extname(path) !== `.${opts.inputExtension}`) {

        return pure(<void>undefined);

    } else {

        let p = `${getFileName(path)}.${opts.outputExtension}`;

        return readTextFile(path)
            .chain(buf => {

                let eitherTs = compile(buf, opts);

                if (eitherTs.isLeft())
                    return raise<string>(eitherTs.takeLeft());
                else
                    return pure(eitherTs.takeRight());

            })
            .chain(txt => writeTextFile(p, txt));
    }

}

const getFileName = (file: string) =>
    `${dirname(file)}/${basename(file, extname(file))}`;
