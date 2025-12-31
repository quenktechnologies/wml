// @ts-ignore 6192
import * as __wml from '../../../lib';
// @ts-ignore 6192
import * as __document from '../../../lib/dom';
// @ts-ignore 6192
import * as __utils from '../../../lib/util';



// @ts-ignore 6192
const text = __document.text;
// @ts-ignore 6192
const unsafe = __document.unsafe
// @ts-ignore 6192
const isSet = __utils.isSet
export class ChildText  extends __wml.BaseView {

   constructor(__context: object) {

       super(__context, (__this:__wml.Frame) => {

         

         __this.root(__this.node('h4', <__wml.Attrs>{}, [

        __document.createTextNode('Test Text')
     ]));

         return __this;

       });

 }

};
export class CommaText  extends __wml.BaseView {

   constructor(__context: object) {

       super(__context, (__this:__wml.Frame) => {

         

         __this.root(__this.node('p', <__wml.Attrs>{}, [

        __document.createTextNode('We, have a comma!')
     ]));

         return __this;

       });

 }

}
