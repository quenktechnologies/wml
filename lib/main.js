#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var docopt = require("docopt");
var cli_1 = require("./cli");
var args = docopt.docopt("\n\nUsage:\n  wml [options] <path>\n\nOptions:\n  -h --help            Show this screen.\n  --inputExtension ext The file extension used when reading files. [default: wml]\n  --extension ext      The file extension to use when writing files. [default: ts]\n  --module path        The module name or path to get wml symbols from.\n  --version            Show version.\n", {
    version: require('../package.json').version
});
var onErr = function (e) {
    console.error(e.stack ? e.stack : e);
    return process.exit(255);
};
var onDone = function () { return process.exit(0); };
cli_1.execute(process.cwd(), args).fork(onErr, onDone);
//# sourceMappingURL=main.js.map