import * as fs from 'fs';
import { assert } from '@quenk/test/lib/assert';
import { tests } from '../../../lib/parse/test';
import { compile } from '../../../lib/compile/target/dom';

type Test = string | { input: string, skip: any };

const getInput = (t: Test): string =>
    (typeof t === 'string') ? <string>t : t.input;

function compare(tree: any, that: any): void {

    assert(tree).equate(that);

}

function makeTest(test: Test, index: string) {

    var file = index.replace(/\s/g, '-');

    if (process.env.GENERATE) {

        return compile(getInput(test), { module: '../../src', pretty: true })
            .map(txt => { fs.writeFileSync(`./test/fixtures/expectations/${file}.ts`, txt); })
            .fold(e => { throw e; }, () => { });
    }

    compile(getInput(test), { module: '../../src' })
        .map(txt => compare(txt, fs.readFileSync(`./test/fixtures/expectations/${file}.ts`, {
            encoding: 'utf8'
        })))
        .fold(e => { throw e; }, () => { });


}

describe('compile', function() {

    describe('compile()', function() {

        Object.keys(tests).forEach(k => {

            it(k, function() {

                if (Array.isArray(tests[k])) {

                    tests[k].forEach(makeTest);

                } else {

                    makeTest(tests[k], k);

                }

            });
        });

    });

});
