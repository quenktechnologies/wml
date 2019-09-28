"use strict";
/**
 * output typescript code
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** imports */
var nodes = require("../../../parse/ast");
var record_1 = require("@quenk/noni/lib/data/record");
var array_1 = require("@quenk/noni/lib/data/array");
exports.CONTEXT = '__context';
exports.VIEW = '__view';
exports.WML = '__wml';
exports.THIS = '__this';
var prims = [
    'String',
    'Boolean',
    'Number',
    'Object',
    'Undefined',
    'Null',
    'Void',
    'Never',
    'Any'
];
var casters = ['String', 'Boolean', 'Number', 'Object'];
var operators = {
    '==': '===',
    '!=': '!=='
};
/**
 * eol sugar
 */
exports.eol = function (ctx) { return "" + ctx.options.EOL; };
/**
 * module2TS outputs the compiled contents of a module
 * as a typescript module.
 */
exports.module2TS = function (ctx, n) {
    return "import * as " + exports.WML + " from '" + ctx.options.module + "';" + exports.eol(ctx) +
        exports.eol(ctx) +
        ("" + n.imports.map(exports.importStatement2TS).join(';' + exports.eol(ctx))) +
        exports.eol(ctx) +
        ("" + ctx.generator.imports(ctx)) +
        exports.eol(ctx) +
        ("" + ctx.generator.definitions(ctx)) +
        exports.eol(ctx) +
        ("" + n.exports.map(function (e) { return exports.exports2TS(ctx, e); }).join(';' + exports.eol(ctx)));
};
/**
 * importStatement2TS
 */
exports.importStatement2TS = function (n) {
    return "import " + exports.importMember2TS(n.member) + " from '" + n.module.value + "'; ";
};
/**
 * importMember2TS
 */
exports.importMember2TS = function (n) {
    if (n instanceof nodes.AggregateMember)
        return exports.aggregateMember2TS(n);
    else if (n instanceof nodes.AliasedMember)
        return exports.aliasedMember2TS(n);
    else if (n instanceof nodes.CompositeMember)
        return exports.compositeMember2TS(n);
    else
        return '';
};
/**
 * aggregateMember2TS
 */
exports.aggregateMember2TS = function (n) {
    return "* as " + exports.identifierOrConstructor2TS(n.id) + " ";
};
/**
 * aliasedMember2TS
 */
exports.aliasedMember2TS = function (n) {
    return exports.identifierOrConstructor2TS(n.member) + " " +
        ("as " + exports.identifierOrConstructor2TS(n.alias) + " ");
};
/**
 * compositeMember2TS
 */
exports.compositeMember2TS = function (n) {
    return '{' + (n.members.map(function (m) { return (m instanceof nodes.AliasedMember) ?
        exports.aliasedMember2TS(m) :
        exports.identifierOrConstructor2TS(m); }).join(',')) + '}';
};
/**
 * exports2TS
 */
exports.exports2TS = function (ctx, n) {
    if (n instanceof nodes.FunStatement)
        return exports.funStatement2TS(ctx, n);
    else if (n instanceof nodes.ViewStatement)
        return exports.viewStatement2TS(ctx, n);
    else if ((n instanceof nodes.Widget) || (n instanceof nodes.Node))
        return exports.tag2TS(ctx, n);
    else
        return '';
};
/**
 * funStatement2TS
 */
exports.funStatement2TS = function (ctx, n) {
    return ctx.generator.fun(ctx, n);
};
/**
 * viewStatement2TS.
 */
exports.viewStatement2TS = function (ctx, n) {
    return ctx.generator.view(ctx, n);
};
/**
 * typeParameters converts a list of typeParameters into the a list of
 * typescript typeParameters.
 */
exports.typeParameters = function (ns) {
    return (ns.length === 0) ? '' : "<" + ns.map(exports.typeParameter2TS).join(',') + "> ";
};
/**
 * typeParameter2TS converts a type parameter into a typescript type parameter.
 */
exports.typeParameter2TS = function (n) {
    return exports.identifierOrConstructor2TS(n.id) + " " +
        ((n.constraint ? 'extends ' + exports.type2TS(n.constraint) : '') + " ");
};
/**
 * type2TS
 */
exports.type2TS = function (n) {
    var typ = exports.identifierOrConstructor2TS(n.id);
    var asPrim = prims.indexOf(typ) > -1 ? typ.toLowerCase() : typ;
    var typeParams = exports.typeParameters(n.typeParameters);
    return asPrim + " " + typeParams + " " + (n.list ? '[]' : '');
};
/**
 * parameter2TS
 */
exports.parameter2TS = function (n) {
    if (n instanceof nodes.TypedParameter)
        return exports.typedParameter2TS(n);
    else if (n instanceof nodes.UntypedParameter)
        return exports.untypedParameter2TS(n);
    else
        return '';
};
/**
 * typedParameter2TS
 */
exports.typedParameter2TS = function (n) {
    return exports.identifier2TS(n.id) + ": " + exports.type2TS(n.hint) + " ";
};
/**
 * untypedParameter2TS
 */
exports.untypedParameter2TS = function (n) {
    return exports.identifier2TS(n.id) + " ";
};
/**
 * children2TS
 */
exports.children2TS = function (ctx, list) {
    return "[" + ctx.options.EOL + "\n        " + list.map(function (l) { return exports.child2TS(ctx, l); }).join(',' + ctx.options.EOL) + "\n     ]";
};
/**
 * child2TS converts children to typescript.
 */
exports.child2TS = function (ctx, n) {
    if ((n instanceof nodes.Node) || (n instanceof nodes.Widget))
        return exports.tag2TS(ctx, n);
    else if (n instanceof nodes.Interpolation)
        return exports.interpolation2TS(ctx, n);
    else if (n instanceof nodes.IfStatement)
        return exports.ifStatement2TS(ctx, n);
    else if (n instanceof nodes.ForInStatement)
        return exports.forInStatement2TS(ctx, n);
    else if (n instanceof nodes.ForOfStatement)
        return exports.forOfStatement2TS(ctx, n);
    else if (n instanceof nodes.Characters)
        return exports.characters2TS(ctx, n);
    else if (n instanceof nodes.ContextProperty)
        return exports.contextProperty2TS(n);
    else if (n instanceof nodes.QualifiedConstructor)
        return exports.qualifiedConstructor2TS(n);
    else if (n instanceof nodes.UnqualifiedConstructor)
        return exports.unqualifiedConstructor2TS(n);
    else if (n instanceof nodes.UnqualifiedIdentifier)
        return exports.unqualifiedIdentifier2TS(n);
    else if (n instanceof nodes.QualifiedIdentifier)
        return exports.qualifiedIdentifier2TS(n);
    else
        return '';
};
/**
 * tag2TS
 */
exports.tag2TS = function (ctx, n) {
    if (n.type === 'widget') {
        return ctx.generator.widget(ctx, n);
    }
    else {
        return ctx.generator.node(ctx, n);
    }
};
/**
 * attribute2Value
 */
exports.attribute2TS = function (ctx, n) {
    return "'" + exports.unqualifiedIdentifier2TS(n.name) + "' : " + exports.attributeValue2TS(ctx, n.value) + " ";
};
/**
 * attributeValue2TS
 */
exports.attributeValue2TS = function (ctx, n) {
    return (n instanceof nodes.Interpolation) ?
        exports.interpolation2TS(ctx, n) :
        exports.literal2TS(ctx, n);
};
/**
 * attrs2String
 */
exports.attrs2String = function (attrs) {
    return '{' +
        Object.keys(attrs).map(function (name) {
            return Array.isArray(attrs[name]) ?
                name + " : { " + attrs[name].join(',') + " }" :
                name + ": " + attrs[name];
        }) +
        '}';
};
/**
 * groupAttrs
 */
exports.groupAttrs = function (ctx, attrs) {
    var _a = array_1.partition(attrs, function (a) { return (a.namespace.id === ''); }), nns = _a[0], ns = _a[1];
    var nso = ns.reduce(function (p, n) {
        var _a;
        return record_1.merge(p, (_a = {},
            _a[n.namespace.id] = (p[n.namespace.id] || []).concat(exports.attribute2TS(ctx, n)),
            _a));
    }, {});
    return nns.reduce(function (p, n) {
        var _a;
        return record_1.merge(p, (_a = {},
            _a[n.name.id] = exports.attributeValue2TS(ctx, n.value),
            _a));
    }, nso);
};
/**
 * interpolation2TS
 */
exports.interpolation2TS = function (ctx, n) {
    return n.filters.reduce(function (p, c) {
        return exports.expression2TS(ctx, c) + " (" + p + ")";
    }, exports.expression2TS(ctx, n.expression));
};
/**
 * ifStatementTS
 */
exports.ifStatement2TS = function (ctx, n) {
    return ctx.generator.ifelse(ctx, n);
};
/**
 * forInStatement2TS
 */
exports.forInStatement2TS = function (ctx, n) {
    return ctx.generator.forIn(ctx, n);
};
/**
 * forOfStatement2TS
 */
exports.forOfStatement2TS = function (ctx, n) {
    return ctx.generator.forOf(ctx, n);
};
/**
 * characters2TS converts character text to a typescript string.
 */
exports.characters2TS = function (ctx, n) {
    return ctx.generator.text(ctx, n.value);
};
/**
 * expression2TS
 */
exports.expression2TS = function (ctx, n) {
    if (n instanceof nodes.IfThenExpression)
        return exports.ifThenExpression2TS(ctx, n);
    else if (n instanceof nodes.BinaryExpression)
        return exports.binaryExpression2TS(ctx, n);
    else if (n instanceof nodes.UnaryExpression)
        return exports.unaryExpression2TS(ctx, n);
    else if (n instanceof nodes.ViewConstruction)
        return exports.viewConstruction2TS(ctx, n);
    else if (n instanceof nodes.FunApplication)
        return exports.funApplication2TS(ctx, n);
    else if (n instanceof nodes.ConstructExpression)
        return exports.constructExpression2TS(ctx, n);
    else if (n instanceof nodes.CallExpression)
        return exports.callExpression2TS(ctx, n);
    else if (n instanceof nodes.MemberExpression)
        return exports.memberExpression2TS(ctx, n);
    else if (n instanceof nodes.FunctionExpression)
        return exports.functionExpression2TS(ctx, n);
    else if (n instanceof nodes.Record)
        return exports.record2TS(ctx, n);
    else if (n instanceof nodes.List)
        return exports.list2TS(ctx, n);
    else if (n instanceof nodes.BooleanLiteral)
        return exports.boolean2TS(n);
    else if (n instanceof nodes.NumberLiteral)
        return exports.number2TS(n);
    else if (n instanceof nodes.StringLiteral)
        return exports.string2TS(n);
    else if (n instanceof nodes.ContextProperty)
        return exports.contextProperty2TS(n);
    else if (n instanceof nodes.QualifiedConstructor)
        return exports.qualifiedConstructor2TS(n);
    else if (n instanceof nodes.UnqualifiedConstructor)
        return exports.unqualifiedConstructor2TS(n);
    else if (n instanceof nodes.UnqualifiedIdentifier)
        return exports.unqualifiedIdentifier2TS(n);
    else if (n instanceof nodes.QualifiedIdentifier)
        return exports.qualifiedIdentifier2TS(n);
    else if (n instanceof nodes.ContextVariable)
        return exports.contextVariable2TS(n);
    else
        return '';
};
/**
 * ifThenExpression2TS
 */
exports.ifThenExpression2TS = function (ctx, n) {
    var condition = exports.expression2TS(ctx, n.condition);
    var conseq = exports.expression2TS(ctx, n.iftrue);
    var alt = exports.expression2TS(ctx, n.iffalse);
    return "(" + condition + ") ? " + conseq + " :  " + alt;
};
/**
 * binaryExpression2TS
 */
exports.binaryExpression2TS = function (ctx, n) {
    var left = exports.expression2TS(ctx, n.left);
    var right = exports.expression2TS(ctx, n.right);
    var op = operators.hasOwnProperty(n.operator) ?
        operators[n.operator] :
        n.operator;
    return "(" + left + " " + op + " " + right + ")";
};
/**
 * unaryExpression2TS
 */
exports.unaryExpression2TS = function (ctx, n) {
    return n.operator + " (" + exports.expression2TS(ctx, n.expression) + ")";
};
/**
 * viewConstruction2TS
 */
exports.viewConstruction2TS = function (ctx, n) {
    return "(new " + exports.constructor2TS(n.cons) + "(" + exports.expression2TS(ctx, n.context) + ")).render()";
};
/**
 * funApplication2TS
 */
exports.funApplication2TS = function (ctx, n) {
    return "" + exports.expression2TS(ctx, n.target) + exports.typeArgs2TS(n.typeArgs) + " " +
        (exports.args2TS(ctx, n.args) + "(" + exports.THIS + ")");
};
/**
 * constructExpression2TS
 */
exports.constructExpression2TS = function (ctx, n) {
    var cons = exports.constructor2TS(n.cons);
    return ((casters.indexOf(cons) === -1) ?
        'new ' : '') + (cons + "(" + exports.args2TS(ctx, n.args) + ")");
};
/**
 * callExpression2TS
 */
exports.callExpression2TS = function (ctx, n) {
    var target = exports.expression2TS(ctx, n.target);
    var typeArgs = exports.typeArgs2TS(n.typeArgs);
    var args = exports.args2TS(ctx, n.args);
    return "" + target + typeArgs + "(" + args + ")";
};
/**
 * typeArgs2TS
 */
exports.typeArgs2TS = function (ns) {
    return ns.length === 0 ? '' : "<" + ns.map(exports.type2TS).join(',') + ">";
};
/**
 * args2TS converts a list of arguments to a typescript argument tupple.
 */
exports.args2TS = function (ctx, ns) {
    return (ns.length === 0) ? '' : ns.map(function (e) { return exports.expression2TS(ctx, e); }).join(',');
};
/**
 * memberExpression2TS
 */
exports.memberExpression2TS = function (ctx, n) {
    return exports.expression2TS(ctx, n.target) + "." + exports.identifier2TS(n.member) + " ";
};
/**
 * functionExpression2TS
 */
exports.functionExpression2TS = function (ctx, n) {
    var params = n.parameters.map(exports.parameter2TS).join(',');
    var body = exports.expression2TS(ctx, n.body);
    return "(" + params + ") => " + body;
};
/**
 * literal2TS
 */
exports.literal2TS = function (ctx, n) {
    if (n instanceof nodes.BooleanLiteral)
        return exports.boolean2TS(n);
    else if (n instanceof nodes.StringLiteral)
        return exports.string2TS(n);
    else if (n instanceof nodes.NumberLiteral)
        return exports.number2TS(n);
    else if (n instanceof nodes.Record)
        return exports.record2TS(ctx, n);
    else if (n instanceof nodes.List)
        return exports.list2TS(ctx, n);
    else
        return '';
};
/**
 * boolean2TS
 */
exports.boolean2TS = function (n) { return n.value + " "; };
/**
 * string2TS
 */
exports.string2TS = function (n) { return "'" + n.value + "'"; };
/**
 * number2TS
 */
exports.number2TS = function (n) { return "" + parseFloat(n.value); };
/**
 * record2TS
 */
exports.record2TS = function (ctx, n) {
    return "{" + ctx.options.EOL + " \n      " + n.properties.map(function (p) { return exports.property2TS(ctx, p); }).join(',' + ctx.options.EOL) + "\n     }";
};
/**
 * list2TS
 */
exports.list2TS = function (ctx, n) {
    var mems = n.members.map(function (e) { return exports.expression2TS(ctx, e); });
    return "[" + ctx.options.EOL + "\n            " + mems.join(',' + ctx.options.EOL) + "\n            ]";
};
/**
 * property2TS
 */
exports.property2TS = function (ctx, n) {
    return "'" + exports.key2TS(n.key) + "' : " + exports.expression2TS(ctx, n.value);
};
/**
 * key2TS
 */
exports.key2TS = function (n) {
    return (n instanceof nodes.StringLiteral) ? exports.string2TS(n) : exports.identifier2TS(n);
};
/**
 * contextProperty2TS
 */
exports.contextProperty2TS = function (n) {
    return exports.CONTEXT + "." + exports.identifier2TS(n.member);
};
/**
 * contextVariable2TS
 */
exports.contextVariable2TS = function (_) { return "" + exports.CONTEXT; };
/**
 * identifierOrConstructor2TS
 */
exports.identifierOrConstructor2TS = function (n) {
    if ((n instanceof nodes.UnqualifiedIdentifier) ||
        (n instanceof nodes.QualifiedIdentifier))
        return exports.identifier2TS(n);
    else if ((n instanceof nodes.UnqualifiedConstructor) ||
        (n instanceof nodes.QualifiedConstructor))
        return exports.constructor2TS(n);
    else
        '';
};
/**
 * constructor2TS
 */
exports.constructor2TS = function (n) {
    if (n instanceof nodes.QualifiedConstructor)
        return exports.qualifiedConstructor2TS(n);
    else if (n instanceof nodes.UnqualifiedConstructor)
        return exports.unqualifiedConstructor2TS(n);
    else
        return '';
};
/**
 * unqualifiedConstructor2TS
 */
exports.unqualifiedConstructor2TS = function (n) {
    return "" + n.id;
};
/**
 * qualifiedConstructor
 */
exports.qualifiedConstructor2TS = function (n) {
    return n.qualifier + "." + n.member;
};
/**
 * identifier2TS
 */
exports.identifier2TS = function (n) {
    if (n instanceof nodes.QualifiedIdentifier)
        return exports.qualifiedIdentifier2TS(n);
    else if (n instanceof nodes.UnqualifiedIdentifier)
        return exports.unqualifiedIdentifier2TS(n);
    else
        return '';
};
/**
 * qualifiedIdentifier2TS
 */
exports.qualifiedIdentifier2TS = function (n) {
    return n.qualifier + "." + n.member;
};
/**
 * unqualifiedIdentifier2TS
 */
exports.unqualifiedIdentifier2TS = function (n) {
    return "" + n.id;
};
//# sourceMappingURL=output.js.map