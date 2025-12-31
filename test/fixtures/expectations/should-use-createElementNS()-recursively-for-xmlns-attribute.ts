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
export class TestView  extends __wml.BaseView {

   constructor(__context: object ) {

       super(__context, (__this:__wml.Frame) => {

         

         __this.root(__this.node('svg', <__wml.Attrs>{wml : { 'ns' : "svg"  },'viewBox': "0 0 100 100",'xmlns': "http://www.w3.org/2000/svg"}, [

        __this.node('path', <__wml.Attrs>{wml : { 'ns' : "svg"  },'fill': "none",'stroke': "red",'d': "M 10,10 h 10"+"       m  0,10 h 10"+"       m  0,10 h 10"+"       M 40,20 h 10"+"       m  0,10 h 10"+"       m  0,10 h 10"+"       m  0,10 h 10"+"       M 50,50 h 10"+"       m-20,10 h 10"+"       m-20,10 h 10"+"       m-20,10 h 10"}, [

        
     ])
     ]));


       });

 }

}