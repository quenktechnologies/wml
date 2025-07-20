import * as fs from 'fs';

import { assert } from '@quenk/test/lib/assert';

import { tests } from '../../lib/parse/test';
import { compile } from '../../lib/compile';

type Test = string | { input: string, skip: any };

const getInput = (t: Test): string =>
    (typeof t === 'string') ? <string>t : t.input;

const opts = { module: '../../../src', dom: '../../../src/dom' };

function compare(tree: any, that: any): void {

    assert(tree).equate(that);

}

function makeTest(test: Test, index: string) {

    var file = index.replace(/\s/g, '-');

    if (process.env.GENERATE) {

        return compile(getInput(test), opts)
            .map(txt => { fs.writeFileSync(`./test/fixtures/expectations/${file}.ts`, txt); })
            .fold(e => { throw e; }, () => { });
    }

    compile(getInput(test), opts)
        .map(txt => compare(txt, fs.readFileSync(`./test/fixtures/expectations/${file}.ts`, {
            encoding: 'utf8'
        })))
        .fold(e => { throw e; }, () => { });


}

describe('compile', function() {

    describe('compile()', function() {

        Object.keys(tests).forEach(k => {

            it(k, function() {


                    makeTest(tests[k], k);

            });
        });

    });

});
