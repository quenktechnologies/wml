import * as fs from 'fs';
import { assert } from '@quenk/test/lib/assert';
import { tests } from '../lib/parse/test';
import { parse } from '../lib/parse';

function json(tree: any): string {
    return JSON.stringify(tree, null, 2);
}

function compare(tree: any, that: any): void {

    assert(tree).equate(that);

}

function makeTest(test: any, index: string) {

    var file = index.replace(/\s/g, '-');

    if (process.env.GENERATE) {

        return parse(typeof test === 'string' ? test : test.input)
            .map(json)
            .map(txt => {
                fs.writeFileSync(`./test/fixtures/expectations/${file}.json`, txt);
            })
            .fold(e => { throw e; }, () => { });
    }

    if (!test.skip) {

        parse(typeof test === 'string' ? test : test.input)
            .map(json)
            .map(txt =>
                compare(txt, fs.readFileSync(`./test/fixtures/expectations/${file}.json`, {
                    encoding: 'utf8'
                })))
            .fold(e => { throw e; }, () => { });

    }

}

describe('Parser', function() {

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
