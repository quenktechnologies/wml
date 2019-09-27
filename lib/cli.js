"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var record_1 = require("@quenk/noni/lib/data/record");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var file_1 = require("@quenk/noni/lib/io/file");
var dom_1 = require("./compile/target/dom");
var defaultOptions = {
    debug: false,
    main: 'Main',
    module: '@quenk/wml',
    inputExtension: 'wml',
    extension: 'ts'
};
var getFileName = function (file) {
    return path_1.dirname(file) + "/" + path_1.basename(file, path_1.extname(file));
};
var getOptions = function (args) {
    var o = {};
    if (args['--main'] != null)
        o.main = args['--main'];
    if (args['--extension'] != null)
        o.extension = args['--extension'];
    if (args['--inputExtension'] != null)
        o.inputExtension = args['--inputExtension'];
    if (args['--module'] != null)
        o.module = args['--module'];
    return o;
};
/**
 * execute the program.
 */
exports.execute = function (cwd, args) {
    var path = path_1.resolve(cwd, args['<path>']);
    var opts = getOptions(args);
    return file_1.isDirectory(path) ?
        exports.compileDir(path, opts) :
        exports.compileFile(path, opts);
};
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
 * compileFile will compile a single file but only if its extension
 * is the target extension.
 */
exports.compileFile = function (path, opts) {
    var o = record_1.merge(defaultOptions, opts);
    if (path_1.extname(path) !== "." + o.inputExtension) {
        return future_1.pure(undefined);
    }
    else {
        var p_1 = getFileName(path) + "." + o.extension;
        return file_1.readTextFile(path)
            .chain(function (buf) {
            var eitherTs = dom_1.compile(buf, o);
            if (eitherTs.isLeft())
                return future_1.raise(eitherTs.takeLeft());
            else
                return future_1.pure(eitherTs.takeRight());
        })
            .chain(function (txt) { return file_1.writeTextFile(p_1, txt); });
    }
};
//# sourceMappingURL=cli.js.map