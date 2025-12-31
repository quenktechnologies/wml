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
export class Test  extends __wml.BaseView {

   constructor(__context: object ) {

       super(__context, (__this:__wml.Frame) => {

         

         __this.root(__this.node('div', <__wml.Attrs>{}, [

        ...((__context.values.controls["@type"]) ?
(()=>([

        __document.createTextNode(' value ')
     ]))() :
(()=>([]))()),
...((__context.values.controls["@type"].value) ?
(()=>([

        __document.createTextNode(' value ')
     ]))() :
(()=>([]))())
     ]));


       });

 }

}