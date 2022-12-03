import * as __wml from '../../../src';
import * as __document from '../../../src/dom';
//@ts-ignore: 6192
import {
Maybe as __Maybe,
fromNullable as __fromNullable,
fromArray as __fromArray
}
from '@quenk/noni/lib/data/maybe';



//@ts-ignore:6192
type __IfArg = ()=>__wml.Content[]

//@ts-ignore:6192
type __ForAlt = ()=> __wml.Content[]

//@ts-ignore:6192
type __ForInBody<A> =(val:A, idx:number, all:A[])=>__wml.Content[]

//@ts-ignore:6192
type __ForOfBody<A> = (val:A, key:string, all:object) =>__wml.Content[]

//@ts-ignore:6192
interface __Record<A> {

 [key:string]: A

}

//@ts-ignore:6192
const __if = (__expr:boolean, __conseq:__IfArg,__alt?:__IfArg) : Content[]=>
(__expr) ? __conseq() :  __alt ? __alt() : [];

//@ts-ignore:6192
const __forIn = <A>(list:A[], f:__ForInBody<A>, alt:__ForAlt) : __wml.Content[] => {

   let ret:__wml.Content[] = [];

   for(let i=0; i<list.length; i++)
       ret = ret.concat(f(list[i], i, list));

   return ret.length === 0 ? alt() : ret;

}
//@ts-ignore:6192
const __forOf = <A>(o:__Record<A>, f:__ForOfBody<A>,alt:__ForAlt) : __wml.Content[] => {

    let ret:__wml.Content[] = [];

    for(let key in o)
  	    if(o.hasOwnProperty(key)) 
	        ret = ret.concat(f((o)[key], key, o));

    return ret.length === 0 ? alt(): ret;

}


// @ts-ignore 6192
const text = __document.text;
// @ts-ignore 6192
const unsafe = __document.unsafe
// @ts-ignore 6192
const isSet = (value:any) => value != null
__this.node('modal', <__wml.Attrs>{'name': "mymodal",'x': "1",'y': "2"}, [

        __this.node('modal-header', <__wml.Attrs>{}, [

        __document.createTextNode('My Modal')
     ]),
__this.node('modal-body', <__wml.Attrs>{}, [

        __document.createTextNode('Creativxity is inhibxited by greed and corruption.'),
__this.node('vote-button', <__wml.Attrs>{}, [

        
     ]),
__this.node('vote-count', <__wml.Attrs>{'source': __context}, [

        
     ]),
__document.createTextNode(' Votes'),
__this.node('textarea', <__wml.Attrs>{wml : { 'id' : "ta"  },'disabled': true ,'size': 32,'onchange': __context.setText}, [

        __document.createTextNode(' Various text')
     ])
     ])
     ])