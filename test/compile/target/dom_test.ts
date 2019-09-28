import * as fs from 'fs';
import { assert } from '@quenk/test/lib/assert';
import { tests } from '../../../lib/parse/test';
import { compile } from '../../../lib/compile/target/dom';

function compare(tree: any, that: any): void {

    assert(tree).equate(that);

}

function makeTest(test: { input: string; skip: any; }, index: string) {

    var file = index.replace(/\s/g, '-');

    if (process.env.GENERATE) {

        return compile(test.input, { module: '../../src', pretty: true })
            .map(txt => { fs.writeFileSync(`./test/fixtures/expectations/${file}.ts`, txt); })
            .fold(e => { throw e; }, () => { });
    }

    if (!test.skip) {

        compile(test.input, { module: '../../src' })
            .map(txt => compare(txt, fs.readFileSync(`./test/fixtures/expectations/${file}.ts`, {
                encoding: 'utf8'
            })))
            .fold(e => { throw e; }, () => { });

    }

}

describe('Parser', function() {

    beforeEach(function() {


    });

    describe('parse()', function() {

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
