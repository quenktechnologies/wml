import { Module } from './AST';

export interface Parser {

    parse(src: string): Module;
    yy: any;

}

export declare function parse(src: string): Module;

export declare let parser: Parser;
