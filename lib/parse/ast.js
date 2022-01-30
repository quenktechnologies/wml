"use strict";
/**
 * Types corresponding to the WML AST.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualifiedConstructor = exports.UnqualifiedConstructor = exports.ContextVariable = exports.ContextProperty = exports.BooleanLiteral = exports.NumberLiteral = exports.StringLiteral = exports.Property = exports.Record = exports.List = exports.FunctionExpression = exports.ReadExpression = exports.MemberExpression = exports.CallExpression = exports.ConstructExpression = exports.FunApplication = exports.ViewConstruction = exports.TypeAssertion = exports.UnaryExpression = exports.BinaryExpression = exports.IfThenExpression = exports.Characters = exports.ElseIfClause = exports.ElseClause = exports.IfStatement = exports.ForOfStatement = exports.ForInStatement = exports.Interpolation = exports.Attribute = exports.Widget = exports.Node = exports.UntypedParameter = exports.TypedParameter = exports.TupleType = exports.ListType = exports.RecordType = exports.FunctionType = exports.ConstructorType = exports.TypeParameter = exports.FunStatement = exports.ViewStatement = exports.LetStatement = exports.MemberDeclaration = exports.ContextStatement = exports.AliasStatement = exports.CompositeMember = exports.AggregateMember = exports.AliasedMember = exports.ImportStatement = exports.Module = void 0;
exports.QualifiedIdentifier = exports.UnqualifiedIdentifier = void 0;
;
/**
 * Module is what a wml file compiles to.
 *
 * A module contains a list of imports and exported symbols.
 * All declarations in wml are exported. There is no such thing
 * as private here.
 */
var Module = /** @class */ (function () {
    function Module(imports, exports, location) {
        this.imports = imports;
        this.exports = exports;
        this.location = location;
        this.type = 'module';
    }
    return Module;
}());
exports.Module = Module;
/**
 * ImportStatement
 */
var ImportStatement = /** @class */ (function () {
    function ImportStatement(member, module, location) {
        this.member = member;
        this.module = module;
        this.location = location;
        this.type = 'import-statement';
    }
    return ImportStatement;
}());
exports.ImportStatement = ImportStatement;
/**
 * AliasedMember
 * @property {Identifier} alias - The identifier introduced to scope.
 * @property {Identifier} member - The identifier that is aliased.
 */
var AliasedMember = /** @class */ (function () {
    function AliasedMember(member, alias, location) {
        this.member = member;
        this.alias = alias;
        this.location = location;
        this.type = 'aliased-member';
    }
    return AliasedMember;
}());
exports.AliasedMember = AliasedMember;
/**
 * AggregateMember
 */
var AggregateMember = /** @class */ (function () {
    function AggregateMember(id, location) {
        this.id = id;
        this.location = location;
        this.type = 'qualified-member';
    }
    return AggregateMember;
}());
exports.AggregateMember = AggregateMember;
/**
 * CompositeMember
 * @property {...Identifier|Aliased_Member} members
 */
var CompositeMember = /** @class */ (function () {
    function CompositeMember(members, location) {
        this.members = members;
        this.location = location;
        this.type = 'composite-member';
    }
    return CompositeMember;
}());
exports.CompositeMember = CompositeMember;
/**
 * AliasStatement
 */
var AliasStatement = /** @class */ (function () {
    function AliasStatement(id, typeParameters, members, location) {
        this.id = id;
        this.typeParameters = typeParameters;
        this.members = members;
        this.location = location;
        this.type = 'alias-statement';
    }
    return AliasStatement;
}());
exports.AliasStatement = AliasStatement;
/**
 * ContextStatement
 */
var ContextStatement = /** @class */ (function () {
    function ContextStatement(id, typeParameters, members, location) {
        this.id = id;
        this.typeParameters = typeParameters;
        this.members = members;
        this.location = location;
        this.type = 'context-statement';
    }
    return ContextStatement;
}());
exports.ContextStatement = ContextStatement;
/**
 * MemberDeclaration
 */
var MemberDeclaration = /** @class */ (function () {
    function MemberDeclaration(path, kind, optional, location) {
        this.path = path;
        this.kind = kind;
        this.optional = optional;
        this.location = location;
        this.type = 'member-declaration';
    }
    return MemberDeclaration;
}());
exports.MemberDeclaration = MemberDeclaration;
/**
 * LetStatement
 */
var LetStatement = /** @class */ (function () {
    function LetStatement(id, cons, expression, location) {
        this.id = id;
        this.cons = cons;
        this.expression = expression;
        this.location = location;
        this.type = 'let-statement';
    }
    return LetStatement;
}());
exports.LetStatement = LetStatement;
/**
 * ViewStatement
 */
var ViewStatement = /** @class */ (function () {
    function ViewStatement(id, typeParameters, context, directives, root, location) {
        this.id = id;
        this.typeParameters = typeParameters;
        this.context = context;
        this.directives = directives;
        this.root = root;
        this.location = location;
        this.type = 'view-statement';
    }
    return ViewStatement;
}());
exports.ViewStatement = ViewStatement;
var FunStatement = /** @class */ (function () {
    function FunStatement(id, typeParameters, parameters, body, location) {
        this.id = id;
        this.typeParameters = typeParameters;
        this.parameters = parameters;
        this.body = body;
        this.location = location;
        this.type = 'fun-statement';
    }
    return FunStatement;
}());
exports.FunStatement = FunStatement;
/**
 * TypeParameter
 */
var TypeParameter = /** @class */ (function () {
    function TypeParameter(id, constraint, location) {
        this.id = id;
        this.constraint = constraint;
        this.location = location;
        this.type = 'type-parameter';
    }
    return TypeParameter;
}());
exports.TypeParameter = TypeParameter;
/**
 * ConstructorType
 */
var ConstructorType = /** @class */ (function () {
    function ConstructorType(id, typeParameters, location) {
        this.id = id;
        this.typeParameters = typeParameters;
        this.location = location;
        this.type = 'constructor-type';
    }
    return ConstructorType;
}());
exports.ConstructorType = ConstructorType;
/**
 * FunctionType
 */
var FunctionType = /** @class */ (function () {
    function FunctionType(parameters, returnType, location) {
        this.parameters = parameters;
        this.returnType = returnType;
        this.location = location;
        this.type = 'function-type';
    }
    return FunctionType;
}());
exports.FunctionType = FunctionType;
/**
 * RecordType
 */
var RecordType = /** @class */ (function () {
    function RecordType(members, location) {
        this.members = members;
        this.location = location;
        this.type = 'record-type';
    }
    return RecordType;
}());
exports.RecordType = RecordType;
/**
 * ListType
 */
var ListType = /** @class */ (function () {
    function ListType(elementType, location) {
        this.elementType = elementType;
        this.location = location;
        this.type = 'list-type';
    }
    return ListType;
}());
exports.ListType = ListType;
/**
 * TupleType
 */
var TupleType = /** @class */ (function () {
    function TupleType(members, location) {
        this.members = members;
        this.location = location;
        this.type = 'tuple-type';
    }
    return TupleType;
}());
exports.TupleType = TupleType;
/**
 * TypeParameter
 */
var TypedParameter = /** @class */ (function () {
    function TypedParameter(id, hint, location) {
        this.id = id;
        this.hint = hint;
        this.location = location;
        this.type = 'typed-parameter';
    }
    return TypedParameter;
}());
exports.TypedParameter = TypedParameter;
var UntypedParameter = /** @class */ (function () {
    function UntypedParameter(id, location) {
        this.id = id;
        this.location = location;
        this.type = 'untyped-parameter';
    }
    return UntypedParameter;
}());
exports.UntypedParameter = UntypedParameter;
var Node = /** @class */ (function () {
    function Node(open, attributes, children, close) {
        this.open = open;
        this.attributes = attributes;
        this.children = children;
        this.close = close;
        this.type = 'node';
    }
    return Node;
}());
exports.Node = Node;
var Widget = /** @class */ (function () {
    function Widget(open, attributes, children, close) {
        this.open = open;
        this.attributes = attributes;
        this.children = children;
        this.close = close;
        this.type = 'widget';
    }
    return Widget;
}());
exports.Widget = Widget;
var Attribute = /** @class */ (function () {
    function Attribute(namespace, name, value, location) {
        this.namespace = namespace;
        this.name = name;
        this.value = value;
        this.location = location;
        this.type = 'attribute';
    }
    return Attribute;
}());
exports.Attribute = Attribute;
var Interpolation = /** @class */ (function () {
    function Interpolation(expression, filters, location) {
        this.expression = expression;
        this.filters = filters;
        this.location = location;
        this.type = 'interpolation';
    }
    return Interpolation;
}());
exports.Interpolation = Interpolation;
var ForInStatement = /** @class */ (function () {
    function ForInStatement(variables, expression, body, otherwise, location) {
        this.variables = variables;
        this.expression = expression;
        this.body = body;
        this.otherwise = otherwise;
        this.location = location;
        this.type = 'for-in-statement';
    }
    return ForInStatement;
}());
exports.ForInStatement = ForInStatement;
var ForOfStatement = /** @class */ (function () {
    function ForOfStatement(variables, expression, body, otherwise, location) {
        this.variables = variables;
        this.expression = expression;
        this.body = body;
        this.otherwise = otherwise;
        this.location = location;
        this.type = 'for-of-statement';
    }
    return ForOfStatement;
}());
exports.ForOfStatement = ForOfStatement;
var IfStatement = /** @class */ (function () {
    function IfStatement(condition, then, elseClause, location) {
        this.condition = condition;
        this.then = then;
        this.elseClause = elseClause;
        this.location = location;
        this.type = 'if-statement';
    }
    return IfStatement;
}());
exports.IfStatement = IfStatement;
var ElseClause = /** @class */ (function () {
    function ElseClause(children, location) {
        this.children = children;
        this.location = location;
        this.type = 'else-clause';
    }
    return ElseClause;
}());
exports.ElseClause = ElseClause;
var ElseIfClause = /** @class */ (function () {
    function ElseIfClause(condition, then, elseClause, location) {
        this.condition = condition;
        this.then = then;
        this.elseClause = elseClause;
        this.location = location;
        this.type = 'else-if-clause';
    }
    return ElseIfClause;
}());
exports.ElseIfClause = ElseIfClause;
var Characters = /** @class */ (function () {
    function Characters(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'characters';
    }
    return Characters;
}());
exports.Characters = Characters;
var IfThenExpression = /** @class */ (function () {
    function IfThenExpression(condition, iftrue, iffalse, location) {
        this.condition = condition;
        this.iftrue = iftrue;
        this.iffalse = iffalse;
        this.location = location;
        this.type = 'if-then-expression';
    }
    return IfThenExpression;
}());
exports.IfThenExpression = IfThenExpression;
var BinaryExpression = /** @class */ (function () {
    function BinaryExpression(left, operator, right, location) {
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.location = location;
        this.type = 'binary-expression';
    }
    return BinaryExpression;
}());
exports.BinaryExpression = BinaryExpression;
var UnaryExpression = /** @class */ (function () {
    function UnaryExpression(operator, expression) {
        this.operator = operator;
        this.expression = expression;
        this.type = 'unary-expression';
    }
    return UnaryExpression;
}());
exports.UnaryExpression = UnaryExpression;
var TypeAssertion = /** @class */ (function () {
    function TypeAssertion(target, expression) {
        this.target = target;
        this.expression = expression;
        this.type = 'type-assertion';
    }
    return TypeAssertion;
}());
exports.TypeAssertion = TypeAssertion;
var ViewConstruction = /** @class */ (function () {
    function ViewConstruction(expression, location) {
        this.expression = expression;
        this.location = location;
        this.type = 'view-construction';
    }
    return ViewConstruction;
}());
exports.ViewConstruction = ViewConstruction;
var FunApplication = /** @class */ (function () {
    function FunApplication(target, typeArgs, args, location) {
        this.target = target;
        this.typeArgs = typeArgs;
        this.args = args;
        this.location = location;
        this.type = 'fun-application';
    }
    return FunApplication;
}());
exports.FunApplication = FunApplication;
var ConstructExpression = /** @class */ (function () {
    function ConstructExpression(cons, args, location) {
        this.cons = cons;
        this.args = args;
        this.location = location;
        this.type = 'construct-expression';
    }
    return ConstructExpression;
}());
exports.ConstructExpression = ConstructExpression;
var CallExpression = /** @class */ (function () {
    function CallExpression(target, typeArgs, args, location) {
        this.target = target;
        this.typeArgs = typeArgs;
        this.args = args;
        this.location = location;
        this.type = 'call-expression';
    }
    return CallExpression;
}());
exports.CallExpression = CallExpression;
/**
 * MemberExpression
 */
var MemberExpression = /** @class */ (function () {
    function MemberExpression(target, member, location) {
        this.target = target;
        this.member = member;
        this.location = location;
    }
    return MemberExpression;
}());
exports.MemberExpression = MemberExpression;
var ReadExpression = /** @class */ (function () {
    function ReadExpression(target, path, hint, defaults, location) {
        this.target = target;
        this.path = path;
        this.hint = hint;
        this.defaults = defaults;
        this.location = location;
        this.type = 'read-expression';
    }
    return ReadExpression;
}());
exports.ReadExpression = ReadExpression;
var FunctionExpression = /** @class */ (function () {
    function FunctionExpression(parameters, body, location) {
        this.parameters = parameters;
        this.body = body;
        this.location = location;
        this.type = 'function-expression';
    }
    return FunctionExpression;
}());
exports.FunctionExpression = FunctionExpression;
var List = /** @class */ (function () {
    function List(members, location) {
        this.members = members;
        this.location = location;
        this.type = 'list';
    }
    return List;
}());
exports.List = List;
var Record = /** @class */ (function () {
    function Record(properties, location) {
        this.properties = properties;
        this.location = location;
        this.type = 'record';
    }
    return Record;
}());
exports.Record = Record;
var Property = /** @class */ (function () {
    function Property(key, value, location) {
        this.key = key;
        this.value = value;
        this.location = location;
        this.type = 'property';
    }
    return Property;
}());
exports.Property = Property;
var StringLiteral = /** @class */ (function () {
    function StringLiteral(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'string';
    }
    return StringLiteral;
}());
exports.StringLiteral = StringLiteral;
var NumberLiteral = /** @class */ (function () {
    function NumberLiteral(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'number-literal';
    }
    return NumberLiteral;
}());
exports.NumberLiteral = NumberLiteral;
var BooleanLiteral = /** @class */ (function () {
    function BooleanLiteral(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'boolean-literal';
    }
    return BooleanLiteral;
}());
exports.BooleanLiteral = BooleanLiteral;
var ContextProperty = /** @class */ (function () {
    function ContextProperty(member, location) {
        this.member = member;
        this.location = location;
        this.type = 'context-property';
    }
    return ContextProperty;
}());
exports.ContextProperty = ContextProperty;
var ContextVariable = /** @class */ (function () {
    function ContextVariable(location) {
        this.location = location;
        this.type = 'context-variable';
    }
    return ContextVariable;
}());
exports.ContextVariable = ContextVariable;
var UnqualifiedConstructor = /** @class */ (function () {
    function UnqualifiedConstructor(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'unqualified-constructor';
    }
    return UnqualifiedConstructor;
}());
exports.UnqualifiedConstructor = UnqualifiedConstructor;
var QualifiedConstructor = /** @class */ (function () {
    function QualifiedConstructor(qualifier, member, location) {
        this.qualifier = qualifier;
        this.member = member;
        this.location = location;
        this.type = 'qualified-constructor';
    }
    return QualifiedConstructor;
}());
exports.QualifiedConstructor = QualifiedConstructor;
var UnqualifiedIdentifier = /** @class */ (function () {
    function UnqualifiedIdentifier(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'unqualified-identifier';
    }
    return UnqualifiedIdentifier;
}());
exports.UnqualifiedIdentifier = UnqualifiedIdentifier;
/**
 * QualifiedIdentifier
 */
var QualifiedIdentifier = /** @class */ (function () {
    function QualifiedIdentifier(qualifier, member, location) {
        this.qualifier = qualifier;
        this.member = member;
        this.location = location;
        this.type = 'qualified-identifier';
    }
    return QualifiedIdentifier;
}());
exports.QualifiedIdentifier = QualifiedIdentifier;
//# sourceMappingURL=ast.js.map