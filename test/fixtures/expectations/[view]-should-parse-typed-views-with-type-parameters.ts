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
export class Main <A  ,B  >  extends __wml.BaseView {

   constructor(__context: Context<A  ,B  >  ) {

       super(__context, (__this:__wml.Frame) => {

         

         __this.root(__this.node('p', <__wml.Attrs>{}, [

        __context.values
     ]));


       });

 }

}