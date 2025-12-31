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

         

         __this.root(__this.widget(new Widget({'val1': String(__context.value),'val2': Number(__context.value),'val3': Boolean(__context.value)}, [

        
     ]),<__wml.Attrs>{'val1': String(__context.value),'val2': Number(__context.value),'val3': Boolean(__context.value)}));


       });

 }

}