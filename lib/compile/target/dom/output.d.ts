/**
 * output typescript code
 */
/** imports */
import * as nodes from '../../../parse/ast';
import { Context } from '../../code';
export declare const CONTEXT = "__context";
export declare const VIEW = "__view";
export declare const WML = "__wml";
export declare const THIS = "__this";
declare type Ifs = nodes.IfStatement | nodes.ElseIfClause;
/**
 * eol sugar
 */
export declare const eol: (ctx: Context) => string;
/**
 * module2TS outputs the compiled contents of a module
 * as a typescript module.
 */
export declare const module2TS: (ctx: Context, n: nodes.Module) => string;
/**
 * importStatement2TS
 */
export declare const importStatement2TS: (n: nodes.ImportStatement) => string;
/**
 * importMember2TS
 */
export declare const importMember2TS: (n: nodes.ImportMember) => string;
/**
 * aggregateMember2TS
 */
export declare const aggregateMember2TS: (n: nodes.AggregateMember) => string;
/**
 * aliasedMember2TS
 */
export declare const aliasedMember2TS: (n: nodes.AliasedMember) => string;
/**
 * compositeMember2TS
 */
export declare const compositeMember2TS: (n: nodes.CompositeMember) => string;
/**
 * exports2TS
 */
export declare const exports2TS: (ctx: Context, n: nodes.Export) => string;
/**
 * funStatement2TS
 */
export declare const funStatement2TS: (ctx: Context, n: nodes.FunStatement) => string;
/**
 * viewStatement2TS.
 */
export declare const viewStatement2TS: (ctx: Context, n: nodes.ViewStatement) => string;
/**
 * typeParameters converts a list of typeParameters into the a list of
 * typescript typeParameters.
 */
export declare const typeParameters: (ns: nodes.TypeParameter[]) => string;
/**
 * typeParameter2TS converts a type parameter into a typescript type parameter.
 */
export declare const typeParameter2TS: (n: nodes.TypeParameter) => string;
/**
 * type2TS
 */
export declare const type2TS: (n: nodes.Type) => string;
/**
 * parameter2TS
 */
export declare const parameter2TS: (n: nodes.Parameter) => string;
/**
 * typedParameter2TS
 */
export declare const typedParameter2TS: (n: nodes.TypedParameter) => string;
/**
 * untypedParameter2TS
 */
export declare const untypedParameter2TS: (n: nodes.UntypedParameter) => string;
/**
 * children2TS
 */
export declare const children2TS: (ctx: Context, list: nodes.Child[]) => string;
/**
 * child2TS converts children to typescript.
 */
export declare const child2TS: (ctx: Context, n: nodes.Child) => string;
/**
 * tag2TS
 */
export declare const tag2TS: (ctx: Context, n: nodes.Tag) => string;
/**
 * attribute2Value
 */
export declare const attribute2TS: (ctx: Context, n: nodes.Attribute) => string;
/**
 * attributeValue2TS
 */
export declare const attributeValue2TS: (ctx: Context, n: nodes.AttributeValue) => string;
/**
 * attrs2String
 */
export declare const attrs2String: (attrs: {
    [key: string]: string | string[];
}) => string;
/**
 * groupAttrs
 */
export declare const groupAttrs: (ctx: Context, attrs: nodes.Attribute[]) => {
    [key: string]: string | string[];
};
/**
 * interpolation2TS
 */
export declare const interpolation2TS: (ctx: Context, n: nodes.Interpolation) => string;
/**
 * ifStatementTS
 */
export declare const ifStatement2TS: (ctx: Context, n: Ifs) => string;
/**
 * forInStatement2TS
 */
export declare const forInStatement2TS: (ctx: Context, n: nodes.ForInStatement) => string;
/**
 * forOfStatement2TS
 */
export declare const forOfStatement2TS: (ctx: Context, n: nodes.ForStatement) => string;
/**
 * characters2TS converts character text to a typescript string.
 */
export declare const characters2TS: (ctx: Context, n: nodes.Characters) => string;
/**
 * expression2TS
 */
export declare const expression2TS: (ctx: Context, n: nodes.Expression) => string;
/**
 * ifThenExpression2TS
 */
export declare const ifThenExpression2TS: (ctx: Context, n: nodes.IfThenExpression) => string;
/**
 * binaryExpression2TS
 */
export declare const binaryExpression2TS: (ctx: Context, n: nodes.BinaryExpression) => string;
/**
 * unaryExpression2TS
 */
export declare const unaryExpression2TS: (ctx: Context, n: nodes.UnaryExpression) => string;
/**
 * viewConstruction2TS
 */
export declare const viewConstruction2TS: (ctx: Context, n: nodes.ViewConstruction) => string;
export declare const partialApplication2TS: (ctx: Context, ns: nodes.Expression[]) => string;
/**
 * constructExpression2TS
 */
export declare const constructExpression2TS: (ctx: Context, n: nodes.ConstructExpression) => string;
/**
 * callExpression2TS
 */
export declare const callExpression2TS: (ctx: Context, n: nodes.CallExpression) => string;
/**
 * typeArgs2TS
 */
export declare const typeArgs2TS: (ns: nodes.Type[]) => string;
/**
 * args2TS converts a list of arguments to a typescript argument tupple.
 */
export declare const args2TS: (ctx: Context, ns: nodes.Expression[]) => string;
/**
 * memberExpression2TS
 */
export declare const memberExpression2TS: (ctx: Context, n: nodes.MemberExpression) => string;
/**
 * functionExpression2TS
 */
export declare const functionExpression2TS: (ctx: Context, n: nodes.FunctionExpression) => string;
/**
 * literal2TS
 */
export declare const literal2TS: (ctx: Context, n: nodes.Literal) => string;
/**
 * boolean2TS
 */
export declare const boolean2TS: (n: nodes.BooleanLiteral) => string;
/**
 * string2TS
 */
export declare const string2TS: (n: nodes.StringLiteral) => string;
/**
 * number2TS
 */
export declare const number2TS: (n: nodes.NumberLiteral) => string;
/**
 * record2TS
 */
export declare const record2TS: (ctx: Context, n: nodes.Record) => string;
/**
 * list2TS
 */
export declare const list2TS: (ctx: Context, n: nodes.List) => string;
/**
 * property2TS
 */
export declare const property2TS: (ctx: Context, n: nodes.Property) => string;
/**
 * key2TS
 */
export declare const key2TS: (n: nodes.StringLiteral | nodes.UnqualifiedIdentifier) => string;
/**
 * contextProperty2TS
 */
export declare const contextProperty2TS: (n: nodes.ContextProperty) => string;
/**
 * contextVariable2TS
 */
export declare const contextVariable2TS: (_: nodes.ContextVariable) => string;
/**
 * identifierOrConstructor2TS
 */
export declare const identifierOrConstructor2TS: (n: nodes.UnqualifiedIdentifier | nodes.UnqualifiedConstructor | nodes.QualifiedIdentifier | nodes.QualifiedConstructor) => string | undefined;
/**
 * constructor2TS
 */
export declare const constructor2TS: (n: nodes.Constructor) => string;
/**
 * unqualifiedConstructor2TS
 */
export declare const unqualifiedConstructor2TS: (n: nodes.UnqualifiedConstructor) => string;
/**
 * qualifiedConstructor
 */
export declare const qualifiedConstructor2TS: (n: nodes.QualifiedConstructor) => string;
/**
 * identifier2TS
 */
export declare const identifier2TS: (n: nodes.Identifier) => string;
/**
 * qualifiedIdentifier2TS
 */
export declare const qualifiedIdentifier2TS: (n: nodes.QualifiedIdentifier) => string;
/**
 * unqualifiedIdentifier2TS
 */
export declare const unqualifiedIdentifier2TS: (n: nodes.UnqualifiedIdentifier) => string;
export {};
