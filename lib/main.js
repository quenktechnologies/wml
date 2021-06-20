#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var docopt = require("docopt");
var path_1 = require("path");
var record_1 = require("@quenk/noni/lib/data/record");
var file_1 = require("@quenk/noni/lib/io/file");
var cli_1 = require("./cli");
var args = docopt.docopt("\n\nUsage:\n  wml [options] <path>\n\nOptions:\n  -h --help            Show this screen.\n  --inputExtension ext The file extension used when reading files. [default: wml]\n  --extension ext      The file extension to use when writing files. [default: ts]\n  --module path        The module name or path to get wml symbols from.\n  --dom path           The module to resolve the DOM functions from.\n  --version            Show version.\n", {
    version: require('../package.json').version
});
var defaultOptions = {
    debug: false,
    main: 'Main',
    module: '@quenk/wml',
    dom: '@quenk/wml/lib/dom',
    inputExtension: 'wml',
    outputExtension: 'ts'
};
var main = function (cwd, args) {
    var path = path_1.resolve(cwd, args['<path>']);
    var opts = record_1.merge(defaultOptions, getOptions(args));
    return file_1.isDirectory(path) ?
        cli_1.compileDir(path, opts) :
        cli_1.compileFile(path, opts);
};
var getOptions = function (args) {
    var o = {};
    if (args['--main'] != null)
        o.main = args['--main'];
    if (args['--outputExtension'] != null)
        o.outputExtension = args['--outputExtension'];
    if (args['--inputExtension'] != null)
        o.inputExtension = args['--inputExtension'];
    if (args['--module'] != null)
        o.module = args['--module'];
    if (args['--dom'] != null)
        o.dom = args['--dom'];
    return o;
};
var onErr = function (e) {
    console.error(e.stack ? e.stack : e);
    return process.exit(255);
};
var onDone = function () { return process.exit(0); };
main(process.cwd(), args).fork(onErr, onDone);
//# sourceMappingURL=main.js.map