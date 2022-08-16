#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const docopt = require("docopt");
const path_1 = require("path");
const record_1 = require("@quenk/noni/lib/data/record");
const file_1 = require("@quenk/noni/lib/io/file");
const cli_1 = require("./cli");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const args = docopt.docopt(`

Usage:
  wml [options] <path>

Options:
  -h --help            Show this screen.
  --inputExtension ext The file extension used when reading files. [default: wml]
  --extension ext      The file extension to use when writing files. [default: ts]
  --module path        The module name or path to get wml symbols from.
  --dom path           The module to resolve the DOM functions from.
  --version            Show version.
`, {
    version: require('../package.json').version
});
const defaultOptions = {
    debug: false,
    main: 'Main',
    module: '@quenk/wml',
    dom: '@quenk/wml/lib/dom',
    inputExtension: 'wml',
    outputExtension: 'ts'
};
const main = (cwd, args) => (0, future_1.doFuture)(function* () {
    let path = (0, path_1.resolve)(cwd, args['<path>']);
    let opts = (0, record_1.merge)(defaultOptions, getOptions(args));
    let result = yield (0, file_1.isDirectory)(path);
    yield result ? (0, cli_1.compileDir)(path, opts) : (0, cli_1.compileFile)(path, opts);
    return future_1.voidPure;
});
const getOptions = (args) => {
    let o = {};
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
const onErr = (e) => {
    console.error(e.stack ? e.stack : e);
    return process.exit(255);
};
const onDone = () => process.exit(0);
main(process.cwd(), args).fork(onErr, onDone);
//# sourceMappingURL=main.js.map