"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileFile = exports.compileDir = void 0;
var path_1 = require("path");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var file_1 = require("@quenk/noni/lib/io/file");
var compile_1 = require("./compile");
/**
 * compileDir will compile each wml file found in the specified path.
 */
exports.compileDir = function (path, opts) {
    return file_1.listFilesRec(path)
        .map(function (list) {
        return list
            .map(function (p) { return path_1.resolve(path, p); })
            .map(function (p) { return exports.compileFile(p, opts); });
    })
        .chain(future_1.parallel);
};
/**
 * compileFile will compile a single wml file.
 *
 * If that file does not have the specified inputExtension, it will be
 * ignored.
 */
exports.compileFile = function (path, opts) {
    if (path_1.extname(path) !== "." + opts.inputExtension) {
        return future_1.pure(undefined);
    }
    else {
        var p_1 = getFileName(path) + "." + opts.outputExtension;
        return file_1.readTextFile(path)
            .chain(function (buf) {
            var eitherTs = compile_1.compile(buf, opts);
            if (eitherTs.isLeft())
                return future_1.raise(eitherTs.takeLeft());
            else
                return future_1.pure(eitherTs.takeRight());
        })
            .chain(function (txt) { return file_1.writeTextFile(p_1, txt); });
    }
};
var getFileName = function (file) {
    return path_1.dirname(file) + "/" + path_1.basename(file, path_1.extname(file));
};
//# sourceMappingURL=cli.js.map