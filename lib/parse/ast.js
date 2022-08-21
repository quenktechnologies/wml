"use strict";
/**
 * Types corresponding to the WML AST.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnqualifiedConstructor = exports.ContextVariable = exports.ContextProperty = exports.BooleanLiteral = exports.NumberLiteral = exports.StringLiteral = exports.Property = exports.Record = exports.List = exports.FunctionExpression = exports.ReadExpression = exports.MemberExpression = exports.CallExpression = exports.ConstructExpression = exports.FunApplication = exports.ViewConstruction = exports.UnaryExpression = exports.BinaryExpression = exports.IfThenExpression = exports.Characters = exports.ElseIfClause = exports.ElseClause = exports.IfStatement = exports.ForFromStatement = exports.ForOfStatement = exports.ForInStatement = exports.Interpolation = exports.Attribute = exports.Widget = exports.Node = exports.UntypedParameter = exports.TypedParameter = exports.TupleType = exports.ListType = exports.RecordType = exports.FunctionType = exports.ConstructorType = exports.TypeParameter = exports.FunStatement = exports.ViewStatement = exports.ContextFromStatement = exports.LetStatement = exports.MemberDeclaration = exports.ContextStatement = exports.AliasStatement = exports.CompositeMember = exports.AggregateMember = exports.AliasedMember = exports.ImportStatement = exports.Module = void 0;
exports.QualifiedIdentifier = exports.UnqualifiedIdentifier = exports.QualifiedConstructor = void 0;
;
/**
 * Module is what a wml file compiles to.
 *
 * A module contains a list of imports and exported symbols.
 * All declarations in wml are exported. There is no such thing
 * as private here.
 */
class Module {
    constructor(imports, exports, location) {
        this.imports = imports;
        this.exports = exports;
        this.location = location;
        this.type = 'module';
    }
    /**
     * clone this node.
     */
    clone() {
        return new Module(this.imports.slice(), this.exports.slice(), this.location);
    }
}
exports.Module = Module;
/**
 * ImportStatement
 */
class ImportStatement {
    constructor(member, module, location) {
        this.member = member;
        this.module = module;
        this.location = location;
        this.type = 'import-statement';
    }
}
exports.ImportStatement = ImportStatement;
/**
 * AliasedMember
 * @property {Identifier} alias - The identifier introduced to scope.
 * @property {Identifier} member - The identifier that is aliased.
 */
class AliasedMember {
    constructor(member, alias, location) {
        this.member = member;
        this.alias = alias;
        this.location = location;
        this.type = 'aliased-member';
    }
}
exports.AliasedMember = AliasedMember;
/**
 * AggregateMember
 */
class AggregateMember {
    constructor(id, location) {
        this.id = id;
        this.location = location;
        this.type = 'qualified-member';
    }
}
exports.AggregateMember = AggregateMember;
/**
 * CompositeMember
 * @property {...Identifier|Aliased_Member} members
 */
class CompositeMember {
    constructor(members, location) {
        this.members = members;
        this.location = location;
        this.type = 'composite-member';
    }
}
exports.CompositeMember = CompositeMember;
/**
 * AliasStatement
 */
class AliasStatement {
    constructor(id, typeParameters, members, location) {
        this.id = id;
        this.typeParameters = typeParameters;
        this.members = members;
        this.location = location;
        this.type = 'alias-statement';
    }
}
exports.AliasStatement = AliasStatement;
/**
 * ContextStatement
 */
class ContextStatement {
    constructor(id, typeParameters, members, location) {
        this.id = id;
        this.typeParameters = typeParameters;
        this.members = members;
        this.location = location;
        this.type = 'context-statement';
    }
}
exports.ContextStatement = ContextStatement;
/**
 * MemberDeclaration
 */
class MemberDeclaration {
    constructor(path, kind, optional, location) {
        this.path = path;
        this.kind = kind;
        this.optional = optional;
        this.location = location;
        this.type = 'member-declaration';
    }
}
exports.MemberDeclaration = MemberDeclaration;
/**
 * LetStatement
 */
class LetStatement {
    constructor(id, cons, expression, location) {
        this.id = id;
        this.cons = cons;
        this.expression = expression;
        this.location = location;
        this.type = 'let-statement';
    }
}
exports.LetStatement = LetStatement;
/**
 * ContextFromStatement
 */
class ContextFromStatement {
    constructor(cons, module, location) {
        this.cons = cons;
        this.module = module;
        this.location = location;
        this.type = 'context-from-statement';
    }
}
exports.ContextFromStatement = ContextFromStatement;
/**
 * ViewStatement
 */
class ViewStatement {
    constructor(id, typeParameters, context, directives, root, location) {
        this.id = id;
        this.typeParameters = typeParameters;
        this.context = context;
        this.directives = directives;
        this.root = root;
        this.location = location;
        this.type = 'view-statement';
    }
}
exports.ViewStatement = ViewStatement;
class FunStatement {
    constructor(id, typeParameters, parameters, body, location) {
        this.id = id;
        this.typeParameters = typeParameters;
        this.parameters = parameters;
        this.body = body;
        this.location = location;
        this.type = 'fun-statement';
    }
}
exports.FunStatement = FunStatement;
/**
 * TypeParameter
 */
class TypeParameter {
    constructor(id, constraint, location) {
        this.id = id;
        this.constraint = constraint;
        this.location = location;
        this.type = 'type-parameter';
    }
}
exports.TypeParameter = TypeParameter;
/**
 * ConstructorType
 */
class ConstructorType {
    constructor(id, typeParameters, location) {
        this.id = id;
        this.typeParameters = typeParameters;
        this.location = location;
        this.type = 'constructor-type';
    }
}
exports.ConstructorType = ConstructorType;
/**
 * FunctionType
 */
class FunctionType {
    constructor(parameters, returnType, location) {
        this.parameters = parameters;
        this.returnType = returnType;
        this.location = location;
        this.type = 'function-type';
    }
}
exports.FunctionType = FunctionType;
/**
 * RecordType
 */
class RecordType {
    constructor(members, location) {
        this.members = members;
        this.location = location;
        this.type = 'record-type';
    }
}
exports.RecordType = RecordType;
/**
 * ListType
 */
class ListType {
    constructor(elementType, location) {
        this.elementType = elementType;
        this.location = location;
        this.type = 'list-type';
    }
}
exports.ListType = ListType;
/**
 * TupleType
 */
class TupleType {
    constructor(members, location) {
        this.members = members;
        this.location = location;
        this.type = 'tuple-type';
    }
}
exports.TupleType = TupleType;
/**
 * TypeParameter
 */
class TypedParameter {
    constructor(id, hint, location) {
        this.id = id;
        this.hint = hint;
        this.location = location;
        this.type = 'typed-parameter';
    }
}
exports.TypedParameter = TypedParameter;
class UntypedParameter {
    constructor(id, location) {
        this.id = id;
        this.location = location;
        this.type = 'untyped-parameter';
    }
}
exports.UntypedParameter = UntypedParameter;
class Node {
    constructor(open, attributes, children, close) {
        this.open = open;
        this.attributes = attributes;
        this.children = children;
        this.close = close;
        this.type = 'node';
    }
}
exports.Node = Node;
class Widget {
    constructor(open, typeArgs, attributes, children, close) {
        this.open = open;
        this.typeArgs = typeArgs;
        this.attributes = attributes;
        this.children = children;
        this.close = close;
        this.type = 'widget';
    }
}
exports.Widget = Widget;
class Attribute {
    constructor(namespace, name, value, location) {
        this.namespace = namespace;
        this.name = name;
        this.value = value;
        this.location = location;
        this.type = 'attribute';
    }
}
exports.Attribute = Attribute;
class Interpolation {
    constructor(expression, filters, location) {
        this.expression = expression;
        this.filters = filters;
        this.location = location;
        this.type = 'interpolation';
    }
}
exports.Interpolation = Interpolation;
class ForInStatement {
    constructor(variables, expression, body, otherwise, location) {
        this.variables = variables;
        this.expression = expression;
        this.body = body;
        this.otherwise = otherwise;
        this.location = location;
        this.type = 'for-in-statement';
    }
}
exports.ForInStatement = ForInStatement;
class ForOfStatement {
    constructor(variables, expression, body, otherwise, location) {
        this.variables = variables;
        this.expression = expression;
        this.body = body;
        this.otherwise = otherwise;
        this.location = location;
        this.type = 'for-of-statement';
    }
}
exports.ForOfStatement = ForOfStatement;
class ForFromStatement {
    constructor(variable, start, end, body, otherwise, location) {
        this.variable = variable;
        this.start = start;
        this.end = end;
        this.body = body;
        this.otherwise = otherwise;
        this.location = location;
        this.type = 'for-from-statement';
    }
}
exports.ForFromStatement = ForFromStatement;
class IfStatement {
    constructor(condition, then, elseClause, location) {
        this.condition = condition;
        this.then = then;
        this.elseClause = elseClause;
        this.location = location;
        this.type = 'if-statement';
    }
}
exports.IfStatement = IfStatement;
class ElseClause {
    constructor(children, location) {
        this.children = children;
        this.location = location;
        this.type = 'else-clause';
    }
}
exports.ElseClause = ElseClause;
class ElseIfClause {
    constructor(condition, then, elseClause, location) {
        this.condition = condition;
        this.then = then;
        this.elseClause = elseClause;
        this.location = location;
        this.type = 'else-if-clause';
    }
}
exports.ElseIfClause = ElseIfClause;
class Characters {
    constructor(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'characters';
    }
}
exports.Characters = Characters;
class IfThenExpression {
    constructor(condition, iftrue, iffalse, location) {
        this.condition = condition;
        this.iftrue = iftrue;
        this.iffalse = iffalse;
        this.location = location;
        this.type = 'if-then-expression';
    }
}
exports.IfThenExpression = IfThenExpression;
class BinaryExpression {
    constructor(left, operator, right, location) {
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.location = location;
        this.type = 'binary-expression';
    }
}
exports.BinaryExpression = BinaryExpression;
class UnaryExpression {
    constructor(operator, expression) {
        this.operator = operator;
        this.expression = expression;
        this.type = 'unary-expression';
    }
}
exports.UnaryExpression = UnaryExpression;
class ViewConstruction {
    constructor(expression, location) {
        this.expression = expression;
        this.location = location;
        this.type = 'view-construction';
    }
}
exports.ViewConstruction = ViewConstruction;
class FunApplication {
    constructor(target, typeArgs, args, location) {
        this.target = target;
        this.typeArgs = typeArgs;
        this.args = args;
        this.location = location;
        this.type = 'fun-application';
    }
}
exports.FunApplication = FunApplication;
class ConstructExpression {
    constructor(cons, typeArgs, args, location) {
        this.cons = cons;
        this.typeArgs = typeArgs;
        this.args = args;
        this.location = location;
        this.type = 'construct-expression';
    }
}
exports.ConstructExpression = ConstructExpression;
class CallExpression {
    constructor(target, typeArgs, args, location) {
        this.target = target;
        this.typeArgs = typeArgs;
        this.args = args;
        this.location = location;
        this.type = 'call-expression';
    }
}
exports.CallExpression = CallExpression;
/**
 * MemberExpression
 */
class MemberExpression {
    constructor(head, tail, location) {
        this.head = head;
        this.tail = tail;
        this.location = location;
    }
}
exports.MemberExpression = MemberExpression;
class ReadExpression {
    constructor(target, path, hint, defaults, location) {
        this.target = target;
        this.path = path;
        this.hint = hint;
        this.defaults = defaults;
        this.location = location;
        this.type = 'read-expression';
    }
}
exports.ReadExpression = ReadExpression;
class FunctionExpression {
    constructor(parameters, body, location) {
        this.parameters = parameters;
        this.body = body;
        this.location = location;
        this.type = 'function-expression';
    }
}
exports.FunctionExpression = FunctionExpression;
class List {
    constructor(members, location) {
        this.members = members;
        this.location = location;
        this.type = 'list';
    }
}
exports.List = List;
class Record {
    constructor(properties, location) {
        this.properties = properties;
        this.location = location;
        this.type = 'record';
    }
}
exports.Record = Record;
class Property {
    constructor(key, value, location) {
        this.key = key;
        this.value = value;
        this.location = location;
        this.type = 'property';
    }
}
exports.Property = Property;
class StringLiteral {
    constructor(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'string';
    }
}
exports.StringLiteral = StringLiteral;
class NumberLiteral {
    constructor(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'number-literal';
    }
}
exports.NumberLiteral = NumberLiteral;
class BooleanLiteral {
    constructor(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'boolean-literal';
    }
}
exports.BooleanLiteral = BooleanLiteral;
class ContextProperty {
    constructor(member, location) {
        this.member = member;
        this.location = location;
        this.type = 'context-property';
    }
}
exports.ContextProperty = ContextProperty;
class ContextVariable {
    constructor(location) {
        this.location = location;
        this.type = 'context-variable';
    }
}
exports.ContextVariable = ContextVariable;
class UnqualifiedConstructor {
    constructor(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'unqualified-constructor';
    }
}
exports.UnqualifiedConstructor = UnqualifiedConstructor;
class QualifiedConstructor {
    constructor(qualifier, member, location) {
        this.qualifier = qualifier;
        this.member = member;
        this.location = location;
        this.type = 'qualified-constructor';
    }
}
exports.QualifiedConstructor = QualifiedConstructor;
class UnqualifiedIdentifier {
    constructor(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'unqualified-identifier';
    }
}
exports.UnqualifiedIdentifier = UnqualifiedIdentifier;
/**
 * QualifiedIdentifier
 */
class QualifiedIdentifier {
    constructor(qualifier, member, location) {
        this.qualifier = qualifier;
        this.member = member;
        this.location = location;
        this.type = 'qualified-identifier';
    }
}
exports.QualifiedIdentifier = QualifiedIdentifier;
//# sourceMappingURL=ast.js.map