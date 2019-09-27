#! /usr/bin/env node

import * as docopt from 'docopt';

import { execute } from './cli';

const args = docopt.docopt(`

Usage:
  wml [options] <path>

Options:
  -h --help            Show this screen.
  --inputExtension ext The file extension used when reading files. [default: wml]
  --extension ext      The file extension to use when writing files. [default: ts]
  --module path        The module name or path to get wml symbols from.
  --version            Show version.
`, {
        version: require('../package.json').version
    });

const onErr = (e: Error) => {

    console.error(e.stack ? e.stack : e);
    return process.exit(255);

}

const onDone = () => process.exit(0);

execute(process.cwd(), args).fork(onErr, onDone);
