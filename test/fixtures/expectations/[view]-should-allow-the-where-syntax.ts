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
export interface HeadViewContext{title : string};
export class HeadView  extends __wml.BaseView {

   constructor(__context: HeadViewContext ) {

       super(__context, (__this:__wml.Frame) => {

         

         __this.root(__this.node('title', <__wml.Attrs>{}, [

        __context.title
     ]));


       });

 }

}