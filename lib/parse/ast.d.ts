/**
 * Types corresponding to the WML AST.
 */
/**
 * Location is jison's location tracking information.
 */
export interface Location {
    [key: string]: string | number;
}
/**
 * AST is the interface of all the nodes
 */
export interface AST {
    type: string;
    location: Location;
}
/**
 * Module is what a wml file compiles to.
 *
 * A module contains a list of imports and exported symbols.
 * All declarations in wml are exported. There is no such thing
 * as private here.
 */
export declare class Module {
    imports: ImportStatement[];
    exports: Export[];
    location: Location;
    type: string;
    constructor(imports: ImportStatement[], exports: Export[], location: Location);
}
/**
 * ImportStatement
 */
export declare class ImportStatement {
    member: ImportMember;
    module: StringLiteral;
    location: Location;
    type: string;
    constructor(member: ImportMember, module: StringLiteral, location: Location);
}
/**
 * ImportMember
 */
export declare type ImportMember = AggregateMember | AliasedMember | CompositeMember;
/**
 * AliasedMember
 * @property {Identifier} alias - The identifier introduced to scope.
 * @property {Identifier} member - The identifier that is aliased.
 */
export declare class AliasedMember {
    member: Member;
    alias: Member;
    location: Location;
    type: string;
    constructor(member: Member, alias: Member, location: Location);
}
/**
 * AggregateMember
 */
export declare class AggregateMember {
    id: Member;
    location: Location;
    type: string;
    constructor(id: Member, location: Location);
}
/**
 * CompositeMember
 * @property {...Identifier|Aliased_Member} members
 */
export declare class CompositeMember {
    members: (Member | AliasedMember)[];
    location: Location;
    type: string;
    constructor(members: (Member | AliasedMember)[], location: Location);
}
export declare type Member = UnqualifiedIdentifier | UnqualifiedConstructor;
export declare type Export = AliasStatement | ContractStatement | FunStatement | ViewStatement | Tag;
/**
 * AliasStatement
 */
export declare class AliasStatement {
    id: UnqualifiedConstructor;
    typeParameters: TypeParameter[];
    members: Type[];
    location: Location;
    type: string;
    constructor(id: UnqualifiedConstructor, typeParameters: TypeParameter[], members: Type[], location: Location);
}
/**
 * ContractStatement
 */
export declare class ContractStatement {
    id: UnqualifiedConstructor;
    typeParameters: TypeParameter[];
    parents: ConstructorType[];
    members: MemberDeclaration[];
    location: Location;
    type: string;
    constructor(id: UnqualifiedConstructor, typeParameters: TypeParameter[], parents: ConstructorType[], members: MemberDeclaration[], location: Location);
}
/**
 * MemberDeclaration
 */
export declare class MemberDeclaration {
    path: UnqualifiedIdentifier[];
    kind: Type;
    optional: boolean;
    location: Location;
    type: string;
    constructor(path: UnqualifiedIdentifier[], kind: Type, optional: boolean, location: Location);
}
/**
 * ViewStatement
 */
export declare class ViewStatement {
    id: UnqualifiedConstructor;
    typeParameters: TypeParameter[];
    context: Type;
    root: Tag;
    location: Location;
    type: string;
    constructor(id: UnqualifiedConstructor, typeParameters: TypeParameter[], context: Type, root: Tag, location: Location);
}
export declare class FunStatement {
    id: UnqualifiedIdentifier;
    typeParameters: TypeParameter[];
    parameters: Parameter[];
    body: Child[];
    location: Location;
    type: string;
    constructor(id: UnqualifiedIdentifier, typeParameters: TypeParameter[], parameters: Parameter[], body: Child[], location: Location);
}
/**
 * TypeParameter
 */
export declare class TypeParameter {
    id: UnqualifiedConstructor;
    constraint: Type;
    location: Location;
    type: string;
    constructor(id: UnqualifiedConstructor, constraint: Type, location: Location);
}
/**
 * Type
 */
export declare type Type = ConstructorType | FunctionType | RecordType | ListType;
/**
 * ConstructorType
 */
export declare class ConstructorType {
    id: UnqualifiedIdentifier | Constructor;
    typeParameters: TypeParameter[];
    location: Location;
    type: string;
    constructor(id: UnqualifiedIdentifier | Constructor, typeParameters: TypeParameter[], location: Location);
}
/**
 * FunctionType
 */
export declare class FunctionType {
    parameters: Type[];
    returnType: Type;
    location: Location;
    type: string;
    constructor(parameters: Type[], returnType: Type, location: Location);
}
/**
 * RecordType
 */
export declare class RecordType {
    members: MemberDeclaration[];
    location: Location;
    type: string;
    constructor(members: MemberDeclaration[], location: Location);
}
/**
 * ListType
 */
export declare class ListType {
    elementType: Type;
    location: Location;
    type: string;
    constructor(elementType: Type, location: Location);
}
/**
 * TupleType
 */
export declare class TupleType {
    members: Type[];
    location: Location;
    type: string;
    constructor(members: Type[], location: Location);
}
/**
 * Parameter
 */
export declare type Parameter = TypedParameter | UntypedParameter;
/**
 * TypeParameter
 */
export declare class TypedParameter {
    id: UnqualifiedIdentifier;
    hint: Type;
    location: Location;
    type: string;
    constructor(id: UnqualifiedIdentifier, hint: Type, location: Location);
}
export declare class UntypedParameter {
    id: UnqualifiedIdentifier;
    location: Location;
    type: string;
    constructor(id: UnqualifiedIdentifier, location: Location);
}
export declare type Child = Tag | Interpolation | Control | Characters | Identifier;
export declare type Tag = Node | Widget;
export declare class Node {
    open: Identifier;
    attributes: Attribute[];
    children: Child[];
    close: Identifier;
    type: string;
    constructor(open: Identifier, attributes: Attribute[], children: Child[], close: Identifier);
}
export declare class Widget {
    open: Constructor;
    attributes: Attribute[];
    children: Child[];
    close: Constructor;
    type: string;
    constructor(open: Constructor, attributes: Attribute[], children: Child[], close: Constructor);
}
export declare class Attribute {
    namespace: UnqualifiedIdentifier;
    name: UnqualifiedIdentifier;
    value: AttributeValue;
    location: Location;
    type: string;
    constructor(namespace: UnqualifiedIdentifier, name: UnqualifiedIdentifier, value: AttributeValue, location: Location);
}
export declare type AttributeValue = Interpolation | Literal;
export declare class Interpolation {
    expression: Expression;
    filters: Expression[];
    location: Location;
    type: string;
    constructor(expression: Expression, filters: Expression[], location: Location);
}
export declare type Control = ForStatement | IfStatement;
export declare type ForStatement = ForInStatement | ForOfStatement;
export declare class ForInStatement {
    variables: Parameter[];
    expression: Expression;
    body: Child[];
    otherwise: Child[];
    location: Location;
    type: string;
    constructor(variables: Parameter[], expression: Expression, body: Child[], otherwise: Child[], location: Location);
}
export declare class ForOfStatement {
    variables: Parameter[];
    expression: Expression;
    body: Child[];
    otherwise: Child[];
    location: Location;
    type: string;
    constructor(variables: Parameter[], expression: Expression, body: Child[], otherwise: Child[], location: Location);
}
export declare class IfStatement {
    condition: Expression;
    then: Child[];
    elseClause: ElseIfClause | ElseClause | undefined;
    location: Location;
    type: string;
    constructor(condition: Expression, then: Child[], elseClause: ElseIfClause | ElseClause | undefined, location: Location);
}
export declare class ElseClause {
    children: Child[];
    location: Location;
    type: string;
    constructor(children: Child[], location: Location);
}
export declare class ElseIfClause {
    condition: Expression;
    then: Child[];
    elseClause: ElseClause | ElseIfClause | undefined;
    location: Location;
    type: string;
    constructor(condition: Expression, then: Child[], elseClause: ElseClause | ElseIfClause | undefined, location: Location);
}
export declare class Characters {
    value: string;
    location: Location;
    type: string;
    constructor(value: string, location: Location);
}
export declare type Expression = IfThenExpression | BinaryExpression | UnaryExpression | TypeAssertion | ViewConstruction | FunApplication | ConstructExpression | CallExpression | MemberExpression | ReadExpression | FunctionExpression | Literal | ContextProperty | Constructor | Identifier | ContextVariable;
export declare class IfThenExpression {
    condition: Expression;
    iftrue: Expression;
    iffalse: Expression;
    location: Location;
    type: string;
    constructor(condition: Expression, iftrue: Expression, iffalse: Expression, location: Location);
}
export declare class BinaryExpression {
    left: Expression;
    operator: string;
    right: Expression;
    location: Location;
    type: string;
    constructor(left: Expression, operator: string, right: Expression, location: Location);
}
export declare class UnaryExpression {
    operator: string;
    expression: Expression;
    type: string;
    constructor(operator: string, expression: Expression);
}
export declare class TypeAssertion {
    target: Type;
    expression: Expression;
    type: string;
    constructor(target: Type, expression: Expression);
}
export declare class ViewConstruction {
    cons: Constructor;
    context: Expression;
    location: Location;
    type: string;
    constructor(cons: Constructor, context: Expression, location: Location);
}
export declare class FunApplication {
    target: Expression;
    typeArgs: Type[];
    args: Expression[];
    location: Location;
    type: string;
    constructor(target: Expression, typeArgs: Type[], args: Expression[], location: Location);
}
export declare class ConstructExpression {
    cons: Constructor;
    args: Expression[];
    location: Location;
    type: string;
    constructor(cons: Constructor, args: Expression[], location: Location);
}
export declare class CallExpression {
    target: Expression;
    typeArgs: Type[];
    args: Expression[];
    location: Location;
    type: string;
    constructor(target: Expression, typeArgs: Type[], args: Expression[], location: Location);
}
/**
 * MemberExpression
 */
export declare class MemberExpression {
    target: Expression;
    member: UnqualifiedIdentifier;
    location: Location;
    constructor(target: Expression, member: UnqualifiedIdentifier, location: Location);
}
export declare class ReadExpression {
    target: Expression;
    path: Expression;
    hint: Type;
    defaults: Expression;
    location: Location;
    type: string;
    constructor(target: Expression, path: Expression, hint: Type, defaults: Expression, location: Location);
}
export declare class FunctionExpression {
    parameters: Parameter[];
    body: Expression;
    location: Location;
    type: string;
    constructor(parameters: Parameter[], body: Expression, location: Location);
}
export declare type Literal = Record | List | StringLiteral | NumberLiteral | BooleanLiteral;
export declare class List {
    members: Expression[];
    location: Location;
    type: string;
    constructor(members: Expression[], location: Location);
}
export declare class Record {
    properties: Property[];
    location: Location;
    type: string;
    constructor(properties: Property[], location: Location);
}
export declare class Property {
    key: UnqualifiedIdentifier | StringLiteral;
    value: Expression;
    location: Location;
    type: string;
    constructor(key: UnqualifiedIdentifier | StringLiteral, value: Expression, location: Location);
}
export declare class StringLiteral {
    value: string;
    location: Location;
    type: string;
    constructor(value: string, location: Location);
}
export declare class NumberLiteral {
    value: string;
    location: Location;
    type: string;
    constructor(value: string, location: Location);
}
export declare class BooleanLiteral {
    value: boolean;
    location: Location;
    type: string;
    constructor(value: boolean, location: Location);
}
export declare class ContextProperty {
    member: UnqualifiedIdentifier;
    location: Location;
    type: string;
    constructor(member: UnqualifiedIdentifier, location: Location);
}
export declare class ContextVariable {
    location: Location;
    type: string;
    constructor(location: Location);
}
export declare type Constructor = UnqualifiedConstructor | QualifiedConstructor;
export declare class UnqualifiedConstructor {
    value: string;
    location: Location;
    type: string;
    constructor(value: string, location: Location);
}
export declare class QualifiedConstructor {
    qualifier: string;
    member: string;
    location: Location;
    type: string;
    constructor(qualifier: string, member: string, location: Location);
}
/**
 * Identifier
 */
export declare type Identifier = UnqualifiedIdentifier | QualifiedIdentifier;
export declare class UnqualifiedIdentifier {
    value: string;
    location: Location;
    type: string;
    constructor(value: string, location: Location);
}
/**
 * QualifiedIdentifier
 */
export declare class QualifiedIdentifier {
    qualifier: string;
    member: string;
    location: Location;
    type: string;
    constructor(qualifier: string, member: string, location: Location);
}
