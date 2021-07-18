/**
 * Typescript code generator.
 */
/** imports */
import * as ast from '../parse/ast';
import { Record } from '@quenk/noni/lib/data/record';
export declare const CONTEXT = "__context";
export declare const VIEW = "__view";
export declare const WML = "__wml";
export declare const DOCUMENT = "__document";
export declare const THIS = "__this";
/**
 *  TypeScript code.
 */
export declare type TypeScript = string;
/**
 * TypeOrMap
 */
export declare type TypeOrMap = TypeScript | ExpandedTypeMap;
/**
 * TypeMap contains a recursive map of dotted paths to Type nodes.
 */
export interface TypeMap extends Record<ast.Type> {
}
/**
 * ExpandedTypeMap is an expanded version of TypeMap.
 *
 * Each dotted path is expanded recursively into records
 * so that no path contain dots.
 */
export interface ExpandedTypeMap extends Record<TypeOrMap> {
}
/**
 * CodeGeneratorOptions
 */
export interface CodeGeneratorOptions {
    /**
     * module path that wml types will be imported from in the output.
     */
    module: string;
    /**
     * dom is the module path that the wml DOM api will be imported from in the
     * output.
     */
    dom: string;
    /**
     * EOL character to use when terminating lines.
     */
    EOL: string;
}
/**
 * CodeGenerator is the main entry point for turning a parsed ast into
 * Typescript code.
 *
 * Given a parsed tree (starting at ast.Module), its generate method will
 * provide a typescript module.
 */
export declare class CodeGenerator {
    options: CodeGeneratorOptions;
    constructor(options: CodeGeneratorOptions);
    /**
     * create a new CodeGenerator instance.
     */
    static create(opts: CodeGeneratorOptions): CodeGenerator;
    /**
     * generate a Typescript module from an WML AST.
     */
    generate(tree: ast.Module): TypeScript;
}
/**
 * importStatements2TS converts a list of ImportStatements into typescript.
 */
export declare const importStatements2TS: (ctx: CodeGenerator, list: ast.ImportStatement[]) => TypeScript;
/**
 * importStatement2TS
 */
export declare const importStatement2TS: (n: ast.ImportStatement) => TypeScript;
/**
 * importMember2TS
 */
export declare const importMember2TS: (n: ast.ImportMember) => string;
/**
 * aggregateMember2TS
 */
export declare const aggregateMember2TS: (n: ast.AggregateMember) => string;
/**
 * aliasedMember2TS
 */
export declare const aliasedMember2TS: (n: ast.AliasedMember) => string;
/**
 * compositeMember2TS
 */
export declare const compositeMember2TS: (n: ast.CompositeMember) => string;
/**
 * exports2TS converts a list of exports to typescript.
 */
export declare const exports2TS: (ctx: CodeGenerator, list: ast.Export[]) => string;
/**
 * export2TS
 */
export declare const export2TS: (ctx: CodeGenerator, n: ast.Export) => string;
/**
 * aliasStatement2TS
 */
export declare const aliasStatement2TS: (n: ast.AliasStatement) => string;
/**
 * contextStatement2TS
 */
export declare const contextStatement2TS: (n: ast.ContextStatement) => string;
/**
 * letStatement2TS
 */
export declare const letStatement2TS: (ctx: CodeGenerator, n: ast.LetStatement) => string;
/**
 * funStatement2TS generates Typescript output for fun statements.
 *
 * This is a curried function that first accepts zero or more arguments then
 * a single Registry, finally the content.
 */
export declare const funStatement2TS: (ctx: CodeGenerator, n: ast.FunStatement) => string;
/**
 * viewStatement2TS converts a ViewStatement to its typescript form.
 *
 * This is a class with template and various useful helpers.
 */
export declare const viewStatement2TS: (ctx: CodeGenerator, n: ast.ViewStatement) => string;
/**
 * typeParameters2TS converts a list of typeParameters2TS into the a list of
 * typescript typeParameters2TS.
 */
export declare const typeParameters2TS: (ns: ast.TypeParameter[]) => string;
/**
 * typeParameter2TS converts a type parameter into a typescript type parameter.
 */
export declare const typeParameter2TS: (n: ast.TypeParameter) => string;
/**
 * type2TS
 */
export declare const type2TS: (n: ast.Type) => TypeScript;
/**
 * constructorType2TS converts a ConstructorType into its id.
 *
 * If the node is generic, the type parameters will be generated as well.
 */
export declare const constructorType2TS: (n: ast.ConstructorType) => string;
/**
 * functionType2TS
 */
export declare const functionType2TS: (n: ast.FunctionType) => string;
/**
 * listType2TS
 */
export declare const listType2TS: (n: ast.ListType) => string;
/**
 * tupleType2TS
 */
export declare const tupleType2TS: (n: ast.TupleType) => string;
/**
 * recordType2TS converts the RecordType node to the body of a TypeScript
 * record interface.
 */
export declare const recordType2Ts: (n: ast.RecordType) => string;
/**
 * memberDeclarations2TS converts a list of MemberDeclarations to TypeScript.
 *
 * The paths of the MemberDeclarations are expanded so that paths
 * using the "<path1>.<path2>.<path3>" syntax occur as nested records.
 */
export declare const memberDeclarations2TS: (n: ast.MemberDeclaration[]) => string;
/**
 * typeMapFromMemberDecs creates a TypeMap from a list of memberDeclarations.
 *
 * This works recursively and any RecordTypes encountered will be flattened.
 */
export declare const typeMapFromMemberDecs: (list: ast.MemberDeclaration[]) => TypeMap;
/**
 * typeMapFromRecordType produces a map of node.Type instances from
 * a RecordType recursively.
 *
 * Any encountered RecordTypes will be flattened.
 */
export declare const typeMapFromRecordType: (n: ast.RecordType, init: TypeMap, prefix: string[]) => TypeMap;
/**
 * expandTypeMap to an ExpandedTypeMap.
 */
export declare const expandTypeMap: (m: TypeMap) => ExpandedTypeMap;
/**
 * typeMap2TS converts a map of type values to TypeScript.
 */
export declare const typeMap2TS: (m: ExpandedTypeMap) => TypeScript;
/**
 * parameters2TS converts a list Parameter nodes into an parameter list
 * (without parens).
 */
export declare const parameters2TS: (list: ast.Parameter[]) => string;
/**
 * parameter2TS
 */
export declare const parameter2TS: (n: ast.Parameter) => string;
/**
 * typedParameter2TS
 */
export declare const typedParameter2TS: (n: ast.TypedParameter) => string;
/**
 * untypedParameter2TS
 */
export declare const untypedParameter2TS: (n: ast.UntypedParameter) => string;
/**
 * children2TS
 */
export declare const children2TS: (ctx: CodeGenerator, list: ast.Child[]) => string;
/**
 * child2TS converts children to typescript.
 */
export declare const child2TS: (ctx: CodeGenerator, n: ast.Child) => string;
/**
 * tag2TS converts a tag to typescript.
 */
export declare const tag2TS: (ctx: CodeGenerator, n: ast.Tag) => string;
/**
 * widget2TS converts a Widget node into its typescript representation.
 *
 * This is simply a call to the View's widget method.
 */
export declare const widget2TS: (ctx: CodeGenerator, n: ast.Widget) => string;
/**
 * node2TS converts a Node into its typescript representation.
 *
 * This is simply a call to the View's node method.
 */
export declare const node2TS: (ctx: CodeGenerator, n: ast.Node) => string;
/**
 * attribute2Value
 */
export declare const attribute2TS: (ctx: CodeGenerator, n: ast.Attribute) => string;
/**
 * attributeValue2TS
 */
export declare const attributeValue2TS: (ctx: CodeGenerator, n: ast.Attribute) => string;
/**
 * attributeName2TS
 */
export declare const attributeName2TS: (_: CodeGenerator, n: ast.Attribute) => string;
/**
 * attrs2String
 */
export declare const attrs2String: (attrs: {
    [key: string]: string | string[];
}) => string;
/**
 * groupAttrs
 */
export declare const groupAttrs: (ctx: CodeGenerator, attrs: ast.Attribute[]) => {
    [key: string]: string | string[];
};
/**
 * interpolation2TS
 */
export declare const interpolation2TS: (ctx: CodeGenerator, n: ast.Interpolation) => string;
/**
 * ifStatementTS converts an IfStatement to its typescript representation.
 */
export declare const ifStatement2TS: (ctx: CodeGenerator, n: ast.IfStatement) => TypeScript;
/**
 * forInStatement2TS converts a ForInStatement to its typescript representation.
 */
export declare const forInStatement2TS: (ctx: CodeGenerator, n: ast.ForInStatement) => string;
/**
 * forOfStatement2TS
 */
export declare const forOfStatement2TS: (ctx: CodeGenerator, n: ast.ForStatement) => string;
/**
 * characters2TS converts character text to a typescript string.
 */
export declare const characters2TS: (n: ast.Characters) => string;
/**
 * expression2TS
 */
export declare const expression2TS: (ctx: CodeGenerator, n: ast.Expression) => string;
/**
 * ifThenExpression2TS
 */
export declare const ifThenExpression2TS: (ctx: CodeGenerator, n: ast.IfThenExpression) => string;
/**
 * binaryExpression2TS
 */
export declare const binaryExpression2TS: (ctx: CodeGenerator, n: ast.BinaryExpression) => string;
/**
 * unaryExpression2TS
 */
export declare const unaryExpression2TS: (ctx: CodeGenerator, n: ast.UnaryExpression) => string;
/**
 * typeAssertion2TS
 */
export declare const typeAssertion2TS: (ctx: CodeGenerator, n: ast.TypeAssertion) => string;
/**
 * viewConstruction2TS
 */
export declare const viewConstruction2TS: (ctx: CodeGenerator, n: ast.ViewConstruction) => string;
/**
 * funApplication2TS
 */
export declare const funApplication2TS: (ctx: CodeGenerator, n: ast.FunApplication) => string;
/**
 * constructExpression2TS
 */
export declare const constructExpression2TS: (ctx: CodeGenerator, n: ast.ConstructExpression) => string;
/**
 * callExpression2TS
 */
export declare const callExpression2TS: (ctx: CodeGenerator, n: ast.CallExpression) => string;
/**
 * typeArgs2TS
 */
export declare const typeArgs2TS: (ns: ast.Type[]) => string;
/**
 * args2TS converts a list of arguments to a typescript argument tupple.
 */
export declare const args2TS: (ctx: CodeGenerator, ns: ast.Expression[]) => string;
/**
 * memberExpression2TS
 */
export declare const memberExpression2TS: (ctx: CodeGenerator, n: ast.MemberExpression) => string;
/**
 * functionExpression2TS
 */
export declare const functionExpression2TS: (ctx: CodeGenerator, n: ast.FunctionExpression) => string;
/**
 * literal2TS
 */
export declare const literal2TS: (ctx: CodeGenerator, n: ast.Literal) => string;
/**
 * boolean2TS
 */
export declare const boolean2TS: (n: ast.BooleanLiteral) => string;
/**
 * string2TS
 */
export declare const string2TS: (n: ast.StringLiteral) => string;
/**
 * number2TS
 */
export declare const number2TS: (n: ast.NumberLiteral) => string;
/**
 * record2TS
 */
export declare const record2TS: (ctx: CodeGenerator, n: ast.Record) => string;
/**
 * list2TS
 */
export declare const list2TS: (ctx: CodeGenerator, n: ast.List) => string;
/**
 * property2TS
 */
export declare const property2TS: (ctx: CodeGenerator, n: ast.Property) => string;
/**
 * key2TS
 */
export declare const key2TS: (n: ast.StringLiteral | ast.UnqualifiedIdentifier) => string;
/**
 * contextProperty2TS
 */
export declare const contextProperty2TS: (n: ast.ContextProperty) => string;
/**
 * contextVariable2TS
 */
export declare const contextVariable2TS: (_: ast.ContextVariable) => string;
/**
 * identifierOrConstructor2TS
 */
export declare const identifierOrConstructor2TS: (n: ast.Identifier | ast.Constructor) => string;
/**
 * constructor2TS
 */
export declare const constructor2TS: (n: ast.Constructor) => string;
/**
 * unqualifiedConstructor2TS
 */
export declare const unqualifiedConstructor2TS: (n: ast.UnqualifiedConstructor) => string;
/**
 * qualifiedConstructor
 */
export declare const qualifiedConstructor2TS: (n: ast.QualifiedConstructor) => string;
/**
 * identifier2TS
 */
export declare const identifier2TS: (n: ast.Identifier) => string;
/**
 * qualifiedIdentifier2TS
 */
export declare const qualifiedIdentifier2TS: (n: ast.QualifiedIdentifier) => string;
/**
 * unqualifiedIdentifier2TS
 */
export declare const unqualifiedIdentifier2TS: (n: ast.UnqualifiedIdentifier) => string;
