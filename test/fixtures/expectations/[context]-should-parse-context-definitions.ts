import * as __wml from '../../src';


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
export interface Manager<A  > {name : string,
table : {
name : Text<A  > ,
data : {
record : {
name : string,
table : {
name : Text<A  > ,
data : {
list : (A)[]
}
}
},
list : (A)[],
list2 : ((A)[])[],
list3 : (((A)[])[])[]
}
},
noArgsFunc1 : () => number,
noArgsFunc0 : () => number,
noParensConsArgFunc : ($0:string) => string,
noParensConsGenericArgFunc : ($0:Text<A  > ) => Text<A  > ,
noParensRecordArgFunc : ($0:{}) => {},
noParensListArgFunc : ($0:(string)[]) => (string)[],
parensConsArgFunc : ($0:string) => string,
parensConsArg2Func : ($0:string,$1:string) => string,
parensConsArg3Func : ($0:string,$1:string,$2:string) => string,
parensConsGenericArgFunc : ($0:Text<A  > ) => Text<A  > ,
parensConsGenericArg2Func : ($0:Text<A  > ,$1:Text<A  > ) => Text<A  > ,
parensConsGenericArg3Func : ($0:Text<A  > ,$1:Text<A  > ,$2:Text<A  > ) => Text<A  > ,
parensRecordArgFunc : ($0:{},$1:{name : string},$2:{value : (A)[]}) => {},
parensRecordArg2Func : ($0:{},$1:{name : string}) => {},
parensListArgFunc : ($0:(string)[]) => (string)[],
parensListArg2Func : ($0:(string)[],$1:(string)[]) => (string)[],
parensListArg3Func : ($0:(string)[],$1:(string)[],$2:(string)[]) => (string)[],
funcArgFunc1 : ($0:($0:string) => string) => string,
funcArgFunc2 : ($0:($0:string) => ($0:string) => string) => string,
funcArg2Func : ($0:($0:string) => string,$1:($0:string) => string) => string,
funcArg3Func : ($0:($0:string) => string,$1:($0:string) => string,$2:($0:string) => string) => string,
funcRetGenArray : ($0:number) => (Text<A  > )[],
funcRetMultiArray : ($0:string) => ((number)[])[] }