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
var compileDir = function (path, opts) {
    return (0, file_1.listFilesRec)(path)
        .map(function (list) {
        return list
            .map(function (p) { return (0, path_1.resolve)(path, p); })
            .map(function (p) { return (0, exports.compileFile)(p, opts); });
    })
        .chain(future_1.parallel);
};
exports.compileDir = compileDir;
/**
 * compileFile will compile a single wml file.
 *
 * If that file does not have the specified inputExtension, it will be
 * ignored.
 */
var compileFile = function (path, opts) {
    if ((0, path_1.extname)(path) !== ".".concat(opts.inputExtension)) {
        return (0, future_1.pure)(undefined);
    }
    else {
        var p_1 = "".concat(getFileName(path), ".").concat(opts.outputExtension);
        return (0, file_1.readTextFile)(path)
            .chain(function (buf) {
            var eitherTs = (0, compile_1.compile)(buf, opts);
            if (eitherTs.isLeft())
                return (0, future_1.raise)(eitherTs.takeLeft());
            else
                return (0, future_1.pure)(eitherTs.takeRight());
        })
            .chain(function (txt) { return (0, file_1.writeTextFile)(p_1, txt); });
    }
};
exports.compileFile = compileFile;
var getFileName = function (file) {
    return "".concat((0, path_1.dirname)(file), "/").concat((0, path_1.basename)(file, (0, path_1.extname)(file)));
};
//# sourceMappingURL=cli.js.map