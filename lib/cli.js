"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileFile = exports.compileDir = void 0;
const path_1 = require("path");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const file_1 = require("@quenk/noni/lib/io/file");
const compile_1 = require("./compile");
/**
 * compileDir will compile each wml file found in the specified path.
 */
const compileDir = (path, opts) => (0, file_1.listFilesRec)(path)
    .map(list => list
    .map(p => (0, path_1.resolve)(path, p))
    .map(p => (0, exports.compileFile)(p, opts)))
    .chain(future_1.parallel);
exports.compileDir = compileDir;
/**
 * compileFile will compile a single wml file.
 *
 * If that file does not have the specified inputExtension, it will be
 * ignored.
 */
const compileFile = (path, opts) => (0, future_1.doFuture)(function* () {
    if ((0, path_1.extname)(path) !== `.${opts.inputExtension}`) {
        return (0, future_1.pure)(undefined);
    }
    else {
        let p = `${getFileName(path)}.${opts.outputExtension}`;
        let buf = yield (0, file_1.readTextFile)(path);
        let eitherTs = (0, compile_1.compile)(buf, opts);
        if (eitherTs.isLeft()) {
            let msg = eitherTs.takeLeft().message;
            return (0, future_1.raise)(new Error(`Error occurred while compiling "${path}":\n ${msg}`));
        }
        else {
            yield (0, file_1.writeTextFile)(p, eitherTs.takeRight());
        }
        return future_1.voidPure;
    }
});
exports.compileFile = compileFile;
const getFileName = (file) => `${(0, path_1.dirname)(file)}/${(0, path_1.basename)(file, (0, path_1.extname)(file))}`;
//# sourceMappingURL=cli.js.map