#! /usr/bin/env node

import * as docopt from "docopt";

import { resolve } from "path";

import { merge } from "@quenk/noni/lib/data/record";
import { isDirectory } from "@quenk/noni/lib/io/file";

import { CLIOptions, Arguments, compileDir, compileFile } from "./cli";
import { doFuture, voidPure } from "@quenk/noni/lib/control/monad/future";

const args = docopt.docopt(
  `

Usage:
  wml [options] <path>

Options:
  -h --help            Show this screen.
  --inputExtension ext The file extension used when reading files. [default: wml]
  --extension ext      The file extension to use when writing files. [default: ts]
  --module path        The module name or path to get wml symbols from.
  --dom path           The module to resolve the DOM functions from.
  --version            Show version.
`,
  {
    version: require("../package.json").version,
  },
);

const defaultOptions: CLIOptions = {
  debug: false,
  main: "Main",
  module: "@quenk/wml",
  dom: "@quenk/wml/lib/dom",
  inputExtension: "wml",
  outputExtension: "ts",
};

const main = (cwd: string, args: Arguments) =>
  doFuture<any>(function* () {
    let path = resolve(cwd, <string>args["<path>"]);
    let opts = merge(defaultOptions, getOptions(args));
    let result = yield isDirectory(path);

    yield result ? compileDir(path, opts) : compileFile(path, opts);
    return voidPure;
  });

const getOptions = (args: Arguments): Partial<CLIOptions> => {
  let o: Partial<CLIOptions> = {};

  if (args["--main"] != null) o.main = args["--main"];

  if (args["--outputExtension"] != null)
    o.outputExtension = args["--outputExtension"];

  if (args["--inputExtension"] != null)
    o.inputExtension = args["--inputExtension"];

  if (args["--module"] != null) o.module = args["--module"];

  if (args["--dom"] != null) o.dom = args["--dom"];

  return o;
};

const onErr = (e: Error) => {
  console.error(e.stack ? e.stack : e);
  return process.exit(255);
};

const onDone = () => process.exit(0);

main(process.cwd(), args).fork(onErr, onDone);
