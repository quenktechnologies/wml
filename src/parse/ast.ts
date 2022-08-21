/**
 * Types corresponding to the WML AST.
 */

/**
 * Location is jison's location tracking information.
 */
export interface Location {

    [key: string]: string | number

};

/**
 * AST is the interface of all the nodes
 */
export interface AST {

    type: string

    location: Location

}

/**
 * Module is what a wml file compiles to.
 *
 * A module contains a list of imports and exported symbols.
 * All declarations in wml are exported. There is no such thing
 * as private here.
 */
export class Module {

    type = 'module'

    constructor(
        public imports: ImportStatement[],
        public exports: Export[],
        public location: Location) { }

    /**
     * clone this node.
     */
    clone() {

        return new Module(this.imports.slice(), this.exports.slice(),
            this.location);

    }

}

/**
 * ImportStatement
 */
export class ImportStatement {

    type = 'import-statement';

    constructor(
        public member: ImportMember,
        public module: StringLiteral,
        public location: Location) { }

}

/**
 * ImportMember
 */
export type ImportMember
    = AggregateMember
    | AliasedMember
    | CompositeMember
    ;

/**
 * AliasedMember
 * @property {Identifier} alias - The identifier introduced to scope.
 * @property {Identifier} member - The identifier that is aliased.
 */
export class AliasedMember {

    type = 'aliased-member';

    constructor(
        public member: Member,
        public alias: Member,
        public location: Location) { }

}

/**
 * AggregateMember
 */
export class AggregateMember {

    type = 'qualified-member';

    constructor(public id: Member, public location: Location) { }

}

/**
 * CompositeMember
 * @property {...Identifier|Aliased_Member} members
 */
export class CompositeMember {

    type = 'composite-member';

    constructor(
        public members: (Member | AliasedMember)[],
        public location: Location) { }

}

export type Member
    = UnqualifiedIdentifier
    | UnqualifiedConstructor
    ;

export type Export
    = AliasStatement
    | ContextStatement
    | LetStatement
    | FunStatement
    | ViewStatement
    | Tag
    ;

/**
 * AliasStatement
 */
export class AliasStatement {

    type = 'alias-statement';

    constructor(
        public id: UnqualifiedConstructor,
        public typeParameters: TypeParameter[],
        public members: Type[],
        public location: Location) { }

}

export type ContextStatementMember = ConstructorType | MemberDeclaration;

/**
 * ContextStatement
 */
export class ContextStatement {

    type = 'context-statement';

    constructor(
        public id: UnqualifiedConstructor,
        public typeParameters: TypeParameter[],
        public members: ContextStatementMember[],
        public location: Location) { }

}

/**
 * MemberDeclaration
 */
export class MemberDeclaration {

    type = 'member-declaration';

    constructor(
        public path: UnqualifiedIdentifier[],
        public kind: Type,
        public optional: boolean,
        public location: Location) { }

}

/**
 * LetStatement
 */
export class LetStatement {

    type = 'let-statement';

    constructor(
        public id: UnqualifiedIdentifier,
        public cons: ConstructorType,
        public expression: Expression,
        public location: Location) { }

}

export type ContextTypeIndicator
    = ConstructorType
    | ContextFromStatement
    ;

/**
 * ContextFromStatement
 */
export class ContextFromStatement {

    type = 'context-from-statement';

    constructor(
        public cons: ConstructorType,
        public module: StringLiteral,
        public location: Location) { }

}

/**
 * ViewStatement
 */
export class ViewStatement {

    type = 'view-statement';

    constructor(
        public id: UnqualifiedConstructor,
        public typeParameters: TypeParameter[],
        public context: ContextTypeIndicator,
        public directives: LetStatement[],
        public root: Tag,
        public location: Location) { }

}

export class FunStatement {

    type = 'fun-statement';

    constructor(
        public id: UnqualifiedIdentifier,
        public typeParameters: TypeParameter[],
        public parameters: Parameter[],
        public body: Child[],
        public location: Location) { }

}

/**
 * TypeParameter
 */
export class TypeParameter {

    type = 'type-parameter';

    constructor(
        public id: UnqualifiedConstructor,
        public constraint: Type,
        public location: Location) { }

}

/**
 * Type
 */
export type Type
    = ConstructorType
    | FunctionType
    | RecordType
    | ListType
    ;

/**
 * ConstructorType
 */
export class ConstructorType {

    type = 'constructor-type';

    constructor(
        public id: UnqualifiedIdentifier | Constructor,
        public typeParameters: TypeParameter[],
        public location: Location) { }

}

/**
 * FunctionType
 */
export class FunctionType {

    type = 'function-type';

    constructor(
        public parameters: Type[],
        public returnType: Type,
        public location: Location) { }

}

/**
 * RecordType
 */
export class RecordType {

    type = 'record-type';

    constructor(
        public members: MemberDeclaration[],
        public location: Location) { }

}

/**
 * ListType
 */
export class ListType {

    type = 'list-type';

    constructor(
        public elementType: Type,
        public location: Location) { }

}

/**
 * TupleType
 */
export class TupleType {

    type = 'tuple-type';

    constructor(
        public members: Type[],
        public location: Location) { }

}


/**
 * Parameter
 */
export type Parameter
    = TypedParameter
    | UntypedParameter
    ;

/**
 * TypeParameter
 */
export class TypedParameter {

    type = 'typed-parameter';

    constructor(
        public id: UnqualifiedIdentifier,
        public hint: Type,
        public location: Location) { }

}

export class UntypedParameter {

    type = 'untyped-parameter';

    constructor(
        public id: UnqualifiedIdentifier,
        public location: Location) { }

}

export type Child
    = Tag
    | Interpolation
    | Control
    | Characters
    | Identifier
    ;

export type Tag
    = Node
    | Widget
    ;

export class Node {

    type = 'node';

    constructor(
        public open: Identifier,
        public attributes: Attribute[],
        public children: Child[],
        public close: Identifier) { }

}

export class Widget {

    type = 'widget';

    constructor(
        public open: Constructor,
        public typeArgs: Type[],
        public attributes: Attribute[],
        public children: Child[],
        public close: Constructor) { }

}

export class Attribute {

    type = 'attribute';

    constructor(
        public namespace: UnqualifiedIdentifier,
        public name: UnqualifiedIdentifier,
        public value: AttributeValue,
        public location: Location) { }

}

export type AttributeValue
    = Interpolation
    | Literal
    ;

export class Interpolation {

    type = 'interpolation';

    constructor(
        public expression: Expression,
        public filters: Expression[],
        public location: Location) { }

}

export type Control
    = ForStatement
    | IfStatement
    ;

export type ForStatement
    = ForInStatement
    | ForOfStatement
    | ForFromStatement
    ;

export class ForInStatement {

    type = 'for-in-statement';

    constructor(
        public variables: Parameter[],
        public expression: Expression,
        public body: Child[],
        public otherwise: Child[],
        public location: Location) { }

}

export class ForOfStatement {

    type = 'for-of-statement';

    constructor(
        public variables: Parameter[],
        public expression: Expression,
        public body: Child[],
        public otherwise: Child[],
        public location: Location) { }

}

export class ForFromStatement {

    type = 'for-from-statement';

    constructor(
        public variable: UntypedParameter,
        public start: Expression,
        public end: Expression,
        public body: Child[],
        public otherwise: Child[],
        public location: Location) { }

}

export class IfStatement {

    type = 'if-statement';

    constructor(
        public condition: Expression,
        public then: Child[],
        public elseClause: ElseIfClause | ElseClause | undefined,
        public location: Location) { }

}

export class ElseClause {

    type = 'else-clause';

    constructor(
        public children: Child[],
        public location: Location) { }

}

export class ElseIfClause {

    type = 'else-if-clause';

    constructor(
        public condition: Expression,
        public then: Child[],
        public elseClause: ElseClause | ElseIfClause | undefined,
        public location: Location) { }

}

export class Characters {

    type = 'characters';

    constructor(
        public value: string,
        public location: Location) { }

}

export type Expression
    = IfThenExpression
    | BinaryExpression
    | UnaryExpression
    | ViewConstruction
    | FunApplication
    | ConstructExpression
    | CallExpression
    | MemberExpression
    | ReadExpression
    | FunctionExpression
    | Literal
    | ContextProperty
    | Constructor
    | Identifier
    | ContextVariable
    ;

export class IfThenExpression {

    type = 'if-then-expression';

    constructor(
        public condition: Expression,
        public iftrue: Expression,
        public iffalse: Expression,
        public location: Location) { }

}

export class BinaryExpression {

    type = 'binary-expression';

    constructor(
        public left: Expression,
        public operator: string,
        public right: Expression,
        public location: Location) { }

}

export class UnaryExpression {

    type = 'unary-expression';

    constructor(
        public operator: string,
        public expression: Expression) { }

}

export class ViewConstruction {

    type = 'view-construction';

    constructor(
        public expression: Expression,
        public location: Location) { }

}

export class FunApplication {

    type = 'fun-application';

    constructor(
        public target: Expression,
        public typeArgs: Type[],
        public args: Expression[],
        public location: Location) { }

}

export class ConstructExpression {

    type = 'construct-expression';

    constructor(
        public cons: Constructor,
        public typeArgs: Type[],
        public args: Expression[],
        public location: Location) { }

}

export class CallExpression {

    type = 'call-expression';

    constructor(
        public target: Expression,
        public typeArgs: Type[],
        public args: Expression[],
        public location: Location) { }

}

/**
 * MemberExpression
 */
export class MemberExpression {

    constructor(
        public head: Expression,
        public tail: UnqualifiedIdentifier | UnqualifiedConstructor | StringLiteral,
        public location: Location) { }

}

export class ReadExpression {

    type = 'read-expression';

    constructor(
        public target: Expression,
        public path: Expression,
        public hint: Type,
        public defaults: Expression,
        public location: Location) { }

}

export class FunctionExpression {

    type = 'function-expression';

    constructor(
        public parameters: Parameter[],
        public body: Expression,
        public location: Location) { }

}

export type Literal
    = Record
    | List
    | StringLiteral
    | NumberLiteral
    | BooleanLiteral
    ;

export class List {

    type = 'list';
    constructor(
        public members: Expression[],
        public location: Location) { }

}

export class Record {

    type = 'record';

    constructor(
        public properties: Property[],
        public location: Location) { }

}

export class Property {

    type = 'property';

    constructor(
        public key: UnqualifiedIdentifier | StringLiteral,
        public value: Expression,
        public location: Location) { }

}

export class StringLiteral {

    type = 'string';

    constructor(
        public value: string,
        public location: Location) { }

}

export class NumberLiteral {

    type = 'number-literal';
    constructor(public value: string, public location: Location) { }

}

export class BooleanLiteral {

    type = 'boolean-literal';

    constructor(public value: boolean, public location: Location) { }

}

export class ContextProperty {

    type = 'context-property';

    constructor(
        public member: UnqualifiedIdentifier | StringLiteral,
        public location: Location) { }

}

export class ContextVariable {

    type = 'context-variable';

    constructor(public location: Location) { }

}

export type Constructor
    = UnqualifiedConstructor
    | QualifiedConstructor
    ;

export class UnqualifiedConstructor {

    type = 'unqualified-constructor';

    constructor(
        public value: string,
        public location: Location) { }

}

export class QualifiedConstructor {

    type = 'qualified-constructor';

    constructor(
        public qualifier: string,
        public member: string,
        public location: Location) { }

}

/**
 * Identifier
 */
export type Identifier
    = UnqualifiedIdentifier
    | QualifiedIdentifier
    ;

export class UnqualifiedIdentifier {

    type = 'unqualified-identifier';

    constructor(public value: string, public location: Location) { }

}

/**
 * QualifiedIdentifier
 */
export class QualifiedIdentifier {

    type = 'qualified-identifier';

    constructor(
        public qualifier: string,
        public member: string,
        public location: Location) { }

}
