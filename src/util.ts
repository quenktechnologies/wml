import { Record } from "@quenk/noni/lib/data/record";
import { Type } from "@quenk/noni/lib/data/type";

import { Content } from "./";

export type IfArg = () => Content[];

export type ForAlt = () => Content[];

export type ForInBody<A> = (val: A, idx: number, all: A[]) => Content[];

export type ForOfBody<A> = (val: A, key: string, all: object) => Content[];

export const forIn = <A>(
  list: A[],
  f: ForInBody<A>,
  alt: ForAlt,
): Content[] => {
  let ret: Content[] = [];

  for (let i = 0; i < list.length; i++) ret = ret.concat(f(list[i], i, list));

  return ret.length === 0 ? alt() : ret;
};

export const forOf = <A>(
  o: Record<A>,
  f: ForOfBody<A>,
  alt: ForAlt,
): Content[] => {
  let ret: Content[] = [];

  for (let key in o)
    if (o.hasOwnProperty(key)) ret = ret.concat(f(o[key], key, o));

  return ret.length === 0 ? alt() : ret;
};

export const isSet = (value: Type) => value != null;
