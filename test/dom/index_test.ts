import { assert } from '@quenk/test/lib/assert';

import { ChildText, CommaText } from './wml/child-text';

describe('dom', () => {

    it('should render child text in html elements', () => {

        let view = new ChildText({});
        let element = <HTMLElement>view.render();
        assert(element.outerHTML).equal('<h4>Test Text</h4>');

    });

    it('should not escape commas', () => {
        let view = new CommaText({});
        let element = <HTMLElement>view.render();
        assert(element.outerHTML).equal('<p>We, have a comma!</p>');
    });

});
