import { dirname, basename, resolve, extname } from 'path';

import { merge } from '@quenk/noni/lib/data/record';
import {
    Future,
    pure,
    raise,
    parallel
} from '@quenk/noni/lib/control/monad/future';
import {
    isDirectory,
    listFilesRec,
    readTextFile,
    writeTextFile
} from '@quenk/noni/lib/io/file';

import { Options, compile } from './compile/target/dom';

/**
 * Arguments passed on the command line.
 */
export interface Arguments {

    '--main': string,

    '--extension': string,

    '--inputExtension': string,

    '--module': string,

    '--dom': string,

    '<path>': string

}

const defaultOptions: Options = {
    debug: false,
    main: 'Main',
    module: '@quenk/wml',
    dom: '@quenk/wml/lib/dom',
    inputExtension: 'wml',
    extension: 'ts'
}

const getFileName = (file: string) =>
    `${dirname(file)}/${basename(file, extname(file))}`;

const getOptions = (args: Arguments): Options => {

    let o: Options = {};

    if (args['--main'] != null)
        o.main = args['--main'];

    if (args['--extension'] != null)
        o.extension = args['--extension'];

    if (args['--inputExtension'] != null)
        o.inputExtension = args['--inputExtension'];

    if (args['--module'] != null)
        o.module = args['--module'];

    if (args['--dom'] != null)
        o.dom = args['--dom'];

    return o;

}

/**
 * execute the program.
 */
export const execute = (cwd: string, args: Arguments) => {

    let path = resolve(cwd, <string>args['<path>']);
    let opts = getOptions(args);

    return isDirectory(path) ?
        compileDir(path, opts) :
        compileFile(path, opts);

}

/**
 * compileDir will compile each wml file found in the specified path.
 */
export const compileDir = (path: string, opts: Options) =>
    listFilesRec(path)
        .map(list =>
            list
                .map(p => resolve(path, p))
                .map(p => compileFile(p, opts)))
        .chain(parallel);

/**
 * compileFile will compile a single file but only if its extension
 * is the target extension.
 */
export const compileFile = (path: string, opts: Options): Future<void> => {

    let o = merge(defaultOptions, opts);

    if (extname(path) !== `.${o.inputExtension}`) {

        return pure(<void>undefined);

    } else {

        let p = `${getFileName(path)}.${o.extension}`;

        return readTextFile(path)
            .chain(buf => {

                let eitherTs = compile(buf, o);

                if (eitherTs.isLeft())
                    return raise<string>(eitherTs.takeLeft());
                else
                    return pure(eitherTs.takeRight());

            })
            .chain(txt => writeTextFile(p, txt));
    }

}
