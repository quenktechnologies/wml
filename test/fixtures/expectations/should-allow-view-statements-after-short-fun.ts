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
;
export class Results <A  >  extends __wml.BaseView {

   constructor(__context: Date<A  >  ) {

       super(__context, (__this:__wml.ViewFrame) => {

         

         __this.root(__this.node('ul', <__wml.Attrs>{}, [

        ...__utils.forIn ([

            1,
3,
4
            ], (option , index , _$$all)=> 
([

        __this.node('li', <__wml.Attrs>{}, [

        option,
__document.createTextNode('and'),
index
     ])
     ]), 
()=> ([

        __this.node('p', <__wml.Attrs>{}, [

        __document.createTextNode('De nada!')
     ])
     ]))
     ]));

         return __this;

       });

 }

}