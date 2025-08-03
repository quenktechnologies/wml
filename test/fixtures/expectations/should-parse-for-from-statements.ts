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
__this.node('root', <__wml.Attrs>{}, [

        ...(function forFrom()  {
  let result:__wml.Content[] = [];
  for(let value :number=1; value <=30; value ++)
   result.push(
     ...[

        __this.node('b', <__wml.Attrs>{}, [

        value
     ])
     ]
   );
  return result;
})()
     ])