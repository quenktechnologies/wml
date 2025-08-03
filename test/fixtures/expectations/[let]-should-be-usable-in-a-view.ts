// @ts-ignore 6192
import * as __wml from '../../../src';
// @ts-ignore 6192
import * as __document from '../../../src/lib/dom';
// @ts-ignore 6192
import * as __utils from '../../../src/lib/util';



// @ts-ignore 6192
const text = __document.text;
// @ts-ignore 6192
const unsafe = __document.unsafe
// @ts-ignore 6192
const isSet = __utils.isSet
export class MyView  extends __wml.BaseView {

   constructor(__context: object ) {

       super(__context, (__this:__wml.ViewFrame) => {

         let head:HeadViewContext = {
 
      'title' : "My Title"
     }

         __this.root(__this.node('h1', <__wml.Attrs>{}, [

        __this.view(new HeadView(head))
     ]));

         return __this;

       });

 }

}