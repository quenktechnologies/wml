"use strict";
/**
 * Typescript code generator.
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forOfStatement2TS = exports.forInStatement2TS = exports.ifStatement2TS = exports.interpolation2TS = exports.groupAttrs = exports.attrs2String = exports.attributeName2TS = exports.attributeValue2TS = exports.attribute2TS = exports.node2TS = exports.widget2TS = exports.tag2TS = exports.child2TS = exports.children2TS = exports.untypedParameter2TS = exports.typedParameter2TS = exports.parameter2TS = exports.parameters2TS = exports.typeMap2TS = exports.expandTypeMap = exports.typeMapFromRecordType = exports.typeMapFromMemberDecs = exports.memberDeclarations2TS = exports.recordType2Ts = exports.tupleType2TS = exports.listType2TS = exports.functionType2TS = exports.constructorType2TS = exports.type2TS = exports.typeParameter2TS = exports.typeParameters2TS = exports.viewStatement2TS = exports.funStatement2TS = exports.letStatement2TS = exports.contextStatement2TS = exports.aliasStatement2TS = exports.export2TS = exports.exports2TS = exports.compositeMember2TS = exports.aliasedMember2TS = exports.aggregateMember2TS = exports.importMember2TS = exports.importStatement2TS = exports.importStatements2TS = exports.CodeGenerator = exports.THIS = exports.DOCUMENT = exports.WML = exports.VIEW = exports.CONTEXT = void 0;
exports.unqualifiedIdentifier2TS = exports.qualifiedIdentifier2TS = exports.identifier2TS = exports.qualifiedConstructor2TS = exports.unqualifiedConstructor2TS = exports.constructor2TS = exports.identifierOrConstructor2TS = exports.contextVariable2TS = exports.contextProperty2TS = exports.key2TS = exports.property2TS = exports.list2TS = exports.record2TS = exports.number2TS = exports.string2TS = exports.boolean2TS = exports.literal2TS = exports.functionExpression2TS = exports.memberExpression2TS = exports.args2TS = exports.typeArgs2TS = exports.callExpression2TS = exports.constructExpression2TS = exports.funApplication2TS = exports.viewConstruction2TS = exports.typeAssertion2TS = exports.unaryExpression2TS = exports.binaryExpression2TS = exports.ifThenExpression2TS = exports.expression2TS = exports.characters2TS = void 0;
/** imports */
var ast = require("../parse/ast");
var path_1 = require("@quenk/noni/lib/data/record/path");
var record_1 = require("@quenk/noni/lib/data/record");
var array_1 = require("@quenk/noni/lib/data/array");
var transform_1 = require("./transform");
exports.CONTEXT = '__context';
exports.VIEW = '__view';
exports.WML = '__wml';
exports.DOCUMENT = '__document';
exports.THIS = '__this';
var MAYBE = '__Maybe';
var FROM_NULLABLE = '__fromNullable';
var FROM_ARRAY = '__fromArray';
var NODE_PARAMS = "tag:string, attrs:".concat(exports.WML, ".Attrs, ") +
    "children: ".concat(exports.WML, ".Content[]");
var WIDGET_PARAMS = "w: ".concat(exports.WML, ".Widget, attrs:").concat(exports.WML, ".Attrs");
var REGISTER_VIEW_PARAMS = "v:".concat(exports.WML, ".View");
var REGISTER_PARAMS = "e:".concat(exports.WML, ".WMLElement, ") +
    "attrs:".concat(exports.WML, ".Attributes<any>");
var THROW_CHILD_ERR = '         throw new TypeError(`Can not adopt ' +
    'child ${c} of type \${typeof c}`);';
var THROW_INVALIDATE_ERR = "       throw new Error('invalidate(): cannot " +
    "invalidate this view, it has no parent node!');";
var IGNORE_UNUSED = '//@ts-ignore:6192';
var RECORD = '__Record<A>';
var IF = '__if';
var IFARG = "__IfArg";
var FOR_OF = '__forOf';
var FOR_IN = '__forIn';
var FOR_ALT_TYPE = '__ForAlt';
var FOR_IN_BODY = '__ForInBody<A>';
var FOR_OF_BODY = '__ForOfBody<A>';
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
 * CodeGenerator is the main entry point for turning a parsed ast into
 * Typescript code.
 *
 * Given a parsed tree (starting at ast.Module), its generate method will
 * provide a typescript module.
 */
var CodeGenerator = /** @class */ (function () {
    function CodeGenerator(options) {
        this.options = options;
    }
    /**
     * create a new CodeGenerator instance.
     */
    CodeGenerator.create = function (opts) {
        return new CodeGenerator(opts);
    };
    /**
     * generate a Typescript module from an WML AST.
     */
    CodeGenerator.prototype.generate = function (tree) {
        var newTree = (0, transform_1.transformTree)(tree);
        return [
            "import * as ".concat(exports.WML, " from '").concat(this.options.module, "';"),
            "import * as ".concat(exports.DOCUMENT, " from '").concat(this.options.dom, "';"),
            imports(this),
            (0, exports.importStatements2TS)(this, newTree.imports),
            eol(this),
            typeDefinitions(this),
            eol(this),
            "// @ts-ignore 6192",
            "const text = ".concat(exports.DOCUMENT, ".text;"),
            "// @ts-ignore 6192",
            "const unsafe = ".concat(exports.DOCUMENT, ".unsafe"),
            "// @ts-ignore 6192",
            "const isSet = (value:any) => value != null",
            (0, exports.exports2TS)(this, newTree.exports)
        ].join(eol(this));
    };
    return CodeGenerator;
}());
exports.CodeGenerator = CodeGenerator;
var eol = function (ctx) { return "".concat(ctx.options.EOL); };
var imports = function (ctx) { return [
    "//@ts-ignore: 6192",
    "import {",
    "Maybe as ".concat(MAYBE, ","),
    "fromNullable as ".concat(FROM_NULLABLE, ","),
    "fromArray as ".concat(FROM_ARRAY),
    "}",
    "from '@quenk/noni/lib/data/maybe';"
].join(eol(ctx)); };
var typeDefinitions = function (ctx) { return [
    "".concat(IGNORE_UNUSED),
    "type ".concat(IFARG, " = ()=>").concat(exports.WML, ".Content[]"),
    "",
    "".concat(IGNORE_UNUSED),
    "type ".concat(FOR_ALT_TYPE, " = ()=> ").concat(exports.WML, ".Content[]"),
    "",
    "".concat(IGNORE_UNUSED),
    "type ".concat(FOR_IN_BODY, " =(val:A, idx:number, all:A[])=>") +
        "".concat(exports.WML, ".Content[]"),
    "",
    "".concat(IGNORE_UNUSED),
    "type ".concat(FOR_OF_BODY, " = (val:A, key:string, all:object) =>") +
        "".concat(exports.WML, ".Content[]"),
    "",
    "".concat(IGNORE_UNUSED),
    "interface ".concat(RECORD, " {"),
    "",
    " [key:string]: A",
    "",
    "}",
    "",
    "".concat(IGNORE_UNUSED),
    "const ".concat(IF, " = (__expr:boolean, __conseq:").concat(IFARG, ",__alt?:").concat(IFARG, ") ") +
        ": Content[]=>",
    "(__expr) ? __conseq() :  __alt ? __alt() : [];",
    "",
    "".concat(IGNORE_UNUSED),
    "const ".concat(FOR_IN, " = <A>(list:A[], f:").concat(FOR_IN_BODY, ", alt:") +
        "".concat(FOR_ALT_TYPE, ") : ").concat(exports.WML, ".Content[] => {"),
    "",
    "   let ret:".concat(exports.WML, ".Content[] = [];"),
    "",
    "   for(let i=0; i<list.length; i++)",
    "       ret = ret.concat(f(list[i], i, list));",
    "",
    "   return ret.length === 0 ? alt() : ret;",
    "",
    "}",
    "".concat(IGNORE_UNUSED),
    "const ".concat(FOR_OF, " = <A>(o:").concat(RECORD, ", f:").concat(FOR_OF_BODY, ",") +
        "alt:".concat(FOR_ALT_TYPE, ") : ").concat(exports.WML, ".Content[] => {"),
    "",
    "    let ret:".concat(exports.WML, ".Content[] = [];"),
    "",
    "    for(let key in o)",
    "  \t    if(o.hasOwnProperty(key)) ",
    "\t        ret = ret.concat(f((o)[key], key, o));",
    "",
    "    return ret.length === 0 ? alt(): ret;",
    "",
    "}"
].join(eol(ctx)); };
/**
 * importStatements2TS converts a list of ImportStatements into typescript.
 */
var importStatements2TS = function (ctx, list) {
    return list
        .map(exports.importStatement2TS)
        .filter(function (stmt, idx, list) { return list.indexOf(stmt) == idx; })
        .join(";".concat(eol(ctx)));
};
exports.importStatements2TS = importStatements2TS;
/**
 * importStatement2TS
 */
var importStatement2TS = function (n) {
    return "import ".concat((0, exports.importMember2TS)(n.member), " from '").concat(n.module.value.trim(), "'; ");
};
exports.importStatement2TS = importStatement2TS;
/**
 * importMember2TS
 */
var importMember2TS = function (n) {
    if (n instanceof ast.AggregateMember)
        return (0, exports.aggregateMember2TS)(n);
    else if (n instanceof ast.AliasedMember)
        return (0, exports.aliasedMember2TS)(n);
    else if (n instanceof ast.CompositeMember)
        return (0, exports.compositeMember2TS)(n);
    else
        return '';
};
exports.importMember2TS = importMember2TS;
/**
 * aggregateMember2TS
 */
var aggregateMember2TS = function (n) {
    return "* as ".concat((0, exports.identifierOrConstructor2TS)(n.id), " ");
};
exports.aggregateMember2TS = aggregateMember2TS;
/**
 * aliasedMember2TS
 */
var aliasedMember2TS = function (n) {
    return "".concat((0, exports.identifierOrConstructor2TS)(n.member), " ") +
        "as ".concat((0, exports.identifierOrConstructor2TS)(n.alias), " ");
};
exports.aliasedMember2TS = aliasedMember2TS;
/**
 * compositeMember2TS
 */
var compositeMember2TS = function (n) {
    return '{' + (n.members.map(function (m) { return (m instanceof ast.AliasedMember) ?
        (0, exports.aliasedMember2TS)(m) :
        (0, exports.identifierOrConstructor2TS)(m); }).join(',')) + '}';
};
exports.compositeMember2TS = compositeMember2TS;
/**
 * exports2TS converts a list of exports to typescript.
 */
var exports2TS = function (ctx, list) {
    return list.map(function (e) { return (0, exports.export2TS)(ctx, e); }).join(';' + eol(ctx));
};
exports.exports2TS = exports2TS;
/**
 * export2TS
 */
var export2TS = function (ctx, n) {
    if (n instanceof ast.AliasStatement)
        return (0, exports.aliasStatement2TS)(n);
    else if (n instanceof ast.ContextStatement)
        return (0, exports.contextStatement2TS)(n);
    else if (n instanceof ast.LetStatement)
        return (0, exports.letStatement2TS)(ctx, n);
    else if (n instanceof ast.FunStatement)
        return (0, exports.funStatement2TS)(ctx, n);
    else if (n instanceof ast.ViewStatement)
        return (0, exports.viewStatement2TS)(ctx, n);
    else if ((n instanceof ast.Widget) || (n instanceof ast.Node))
        return (0, exports.tag2TS)(ctx, n);
    else
        return '';
};
exports.export2TS = export2TS;
/**
 * aliasStatement2TS
 */
var aliasStatement2TS = function (n) {
    var typeArgs = (n.typeParameters.length > 0) ?
        (0, exports.typeParameters2TS)(n.typeParameters) : '';
    var preamble = "export type ".concat(n.id.value).concat(typeArgs);
    var members = n.members.map(function (m) { return (0, exports.type2TS)(m); }).join('|');
    return "".concat(preamble, " = ").concat(members, ";");
};
exports.aliasStatement2TS = aliasStatement2TS;
/**
 * contextStatement2TS
 */
var contextStatement2TS = function (n) {
    var preamble = "export interface ".concat(n.id.value);
    var typeArgs = (n.typeParameters.length > 0) ?
        (0, exports.typeParameters2TS)(n.typeParameters) : '';
    var _a = (0, array_1.partition)(n.members, function (member) {
        return member instanceof ast.ConstructorType;
    }), parents = _a[0], members = _a[1];
    var parentList = parents
        .map(exports.constructorType2TS).join(',');
    parentList = (parentList !== '') ? " extends ".concat(parentList) : '';
    return [
        preamble,
        typeArgs,
        parentList,
        '{',
        (0, exports.memberDeclarations2TS)(members),
        '}'
    ].join('');
};
exports.contextStatement2TS = contextStatement2TS;
/**
 * letStatement2TS
 */
var letStatement2TS = function (ctx, n) {
    return _setStatement2TS(ctx, n, 'export const');
};
exports.letStatement2TS = letStatement2TS;
var _setStatement2TS = function (ctx, n, preamble) {
    var id = (0, exports.identifier2TS)(n.id);
    var cons = (0, exports.constructorType2TS)(n.cons);
    preamble = "".concat(preamble, " ").concat(id, ":").concat(cons);
    var value = (0, exports.expression2TS)(ctx, n.expression);
    return "".concat(preamble, " = ").concat(value);
};
/**
 * funStatement2TS generates Typescript output for fun statements.
 *
 * This is a curried function that first accepts zero or more arguments then
 * a single Registry, finally the content.
 */
var funStatement2TS = function (ctx, n) {
    var id = (0, exports.unqualifiedIdentifier2TS)(n.id);
    var typeParams = (0, exports.typeParameters2TS)(n.typeParameters);
    var params = (0, exports.parameters2TS)(n.parameters);
    var factory = "(".concat(exports.THIS, ":").concat(exports.WML, ".Registry) : ").concat(exports.WML, ".Content[] =>");
    var body = (0, exports.children2TS)(ctx, n.body);
    return [
        "export const ".concat(id, " = "),
        "",
        "".concat(typeParams, "(").concat(params, ")=>").concat(factory, " {"),
        "",
        "   return ".concat(body, ";"),
        "",
        "};"
    ].join(eol(ctx));
};
exports.funStatement2TS = funStatement2TS;
/**
 * viewStatement2TS converts a ViewStatement to its typescript form.
 *
 * This is a class with template and various useful helpers.
 */
var viewStatement2TS = function (ctx, n) {
    var instances = n.directives.map(function (i) {
        return _setStatement2TS(ctx, i, 'let');
    }).join(";".concat(ctx.options.EOL));
    var id = n.id ? (0, exports.constructor2TS)(n.id) : 'Main';
    var typeParams = (0, exports.typeParameters2TS)(n.typeParameters);
    // This should be transformed to what we expect.
    var c = (0, exports.type2TS)(n.context);
    var template = (0, exports.tag2TS)(ctx, n.root);
    return [
        "export class ".concat(id, " ").concat(typeParams, " implements ").concat(exports.WML, ".View {"),
        "",
        "   constructor(".concat(exports.CONTEXT, ": ").concat(c, ") {"),
        "",
        "       this.template = (".concat(exports.THIS, ":").concat(exports.WML, ".Registry) => {"),
        "",
        "       ".concat(instances),
        "",
        "           return ".concat(template, ";"),
        "",
        "       }",
        "",
        "   }",
        "",
        "   ids: { [key: string]: ".concat(exports.WML, ".WMLElement } = {};"),
        "",
        "   groups: { [key: string]: ".concat(exports.WML, ".WMLElement[] } = {};"),
        "",
        "   views: ".concat(exports.WML, ".View[] = [];"),
        "",
        "   widgets: ".concat(exports.WML, ".Widget[] = [];"),
        "",
        "   tree: Node = <Node>".concat(exports.DOCUMENT, ".createElement('div');"),
        "",
        "   template: ".concat(exports.WML, ".Template;"),
        "",
        "   registerView(".concat(REGISTER_VIEW_PARAMS, ") : ").concat(exports.WML, ".View {"),
        "",
        "       this.views.push(v);",
        "",
        "       return v;",
        "",
        "}",
        "   register(".concat(REGISTER_PARAMS, ") : ").concat(exports.WML, ".WMLElement {"),
        "",
        "       let attrsMap = (<".concat(exports.WML, ".Attrs><any>attrs)"),
        "",
        "       if(attrsMap.wml) {",
        "",
        "         let {id, group} = attrsMap.wml;",
        "",
        "         if(id != null) {",
        "",
        "             if (this.ids.hasOwnProperty(id))",
        "               throw new Error(`Duplicate id '${id}' detected!`);",
        "",
        "             this.ids[id] = e;",
        "",
        "         }",
        "",
        "         if(group != null) {",
        "",
        "             this.groups[group] = this.groups[group] || [];",
        "             this.groups[group].push(e);",
        "",
        "         }",
        "",
        "         }",
        "       return e;",
        "}",
        "",
        "   node(".concat(NODE_PARAMS, "): ").concat(exports.WML, ".Content {"),
        "",
        "       let e = ".concat(exports.DOCUMENT, ".createElement(tag);"),
        "",
        "       Object.keys(attrs).forEach(key => {",
        "",
        "           let value = (<any>attrs)[key];",
        "",
        "           if (typeof value === 'function') {",
        "",
        "           (<any>e)[key] = value;",
        "",
        "           } else if (typeof value === 'string') {",
        "",
        "               //prevent setting things like disabled=''",
        "               if (value !== '')",
        "               e.setAttribute(key, value);",
        "",
        "           } else if (typeof value === 'boolean') {",
        "",
        "             e.setAttribute(key, '');",
        "",
        "           } else if(!".concat(exports.DOCUMENT, ".isBrowser && "),
        "                     value instanceof ".concat(exports.DOCUMENT, ".WMLDOMText) {"),
        "",
        "             e.setAttribute(key, <any>value);",
        "",
        "           }",
        "",
        "       });",
        "",
        "       children.forEach(c => {",
        "",
        "               switch (typeof c) {",
        "",
        "                   case 'string':",
        "                   case 'number':",
        "                   case 'boolean':",
        "                     let tn = ".concat(exports.DOCUMENT, ".createTextNode(''+c);"),
        "                     e.appendChild(<Node>tn)",
        "                   case 'object':",
        "                       e.appendChild(<Node>c);",
        "                   break;",
        "                   default:",
        "                       ".concat(THROW_CHILD_ERR),
        "",
        "               }})",
        "",
        "       this.register(e, attrs);",
        "",
        "       return e;",
        "",
        "   }",
        "",
        "",
        "   widget(".concat(WIDGET_PARAMS, ") : ").concat(exports.WML, ".Content {"),
        "",
        "       this.register(w, attrs);",
        "",
        "       this.widgets.push(w);",
        "",
        "       return w.render();",
        "",
        "   }",
        "",
        "   findById<E extends ".concat(exports.WML, ".WMLElement>(id: string): ").concat(MAYBE, "<E> {"),
        "",
        "       let mW:".concat(MAYBE, "<E> = ").concat(FROM_NULLABLE, "<E>(<E>this.ids[id])"),
        "",
        "       return this.views.reduce((p,c)=>",
        "       p.isJust() ? p : c.findById(id), mW);",
        "",
        "   }",
        "",
        "   findByGroup<E extends ".concat(exports.WML, ".WMLElement>(name: string): ") +
            "".concat(MAYBE, "<E[]> {"),
        "",
        "      let mGroup:".concat(MAYBE, "<E[]> ="),
        "           ".concat(FROM_ARRAY, "(this.groups.hasOwnProperty(name) ?"),
        "           <any>this.groups[name] : ",
        "           []);",
        "",
        "      return this.views.reduce((p,c) =>",
        "       p.isJust() ? p : c.findByGroup(name), mGroup);",
        "",
        "   }",
        "",
        "   invalidate() : void {",
        "",
        "       let {tree} = this;",
        "       let parent = <Node>tree.parentNode;",
        "",
        "       if (tree == null)",
        "           return console.warn('invalidate(): '+" +
            "       'Missing DOM tree!');",
        "",
        "       if (tree.parentNode == null)",
        "           ".concat(THROW_INVALIDATE_ERR),
        "",
        "       parent.replaceChild(<Node>this.render(), tree) ",
        "",
        "   }",
        "",
        "   render(): ".concat(exports.WML, ".Content {"),
        "",
        "       this.ids = {};",
        "       this.widgets.forEach(w => w.removed());",
        "       this.widgets = [];",
        "       this.views = [];",
        "       this.tree = <Node>this.template(this);",
        "",
        "       this.ids['root'] = (this.ids['root']) ?",
        "       this.ids['root'] : ",
        "       this.tree;",
        "",
        "       this.widgets.forEach(w => w.rendered());",
        "",
        "       return this.tree;",
        "",
        "   }",
        "",
        "}"
    ].join(eol(ctx));
};
exports.viewStatement2TS = viewStatement2TS;
/**
 * typeParameters2TS converts a list of typeParameters2TS into the a list of
 * typescript typeParameters2TS.
 */
var typeParameters2TS = function (ns) {
    return (ns.length === 0) ? '' : "<".concat(ns.map(exports.typeParameter2TS).join(','), "> ");
};
exports.typeParameters2TS = typeParameters2TS;
/**
 * typeParameter2TS converts a type parameter into a typescript type parameter.
 */
var typeParameter2TS = function (n) {
    return "".concat(toPrim((0, exports.identifierOrConstructor2TS)(n.id)), " ") +
        "".concat(n.constraint ? 'extends ' + (0, exports.type2TS)(n.constraint) : '', " ");
};
exports.typeParameter2TS = typeParameter2TS;
/**
 * type2TS
 */
var type2TS = function (n) {
    if (n instanceof ast.ConstructorType)
        return (0, exports.constructorType2TS)(n);
    else if (n instanceof ast.RecordType)
        return (0, exports.recordType2Ts)(n);
    else if (n instanceof ast.ListType)
        return (0, exports.listType2TS)(n);
    else if (n instanceof ast.TupleType)
        return (0, exports.tupleType2TS)(n);
    else if (n instanceof ast.StringLiteral)
        return (0, exports.string2TS)(n);
    else if (n instanceof ast.NumberLiteral)
        return (0, exports.number2TS)(n);
    else if (n instanceof ast.BooleanLiteral)
        return (0, exports.boolean2TS)(n);
    else if (n instanceof ast.FunctionType)
        return (0, exports.functionType2TS)(n);
    return '<error>';
};
exports.type2TS = type2TS;
/**
 * constructorType2TS converts a ConstructorType into its id.
 *
 * If the node is generic, the type parameters will be generated as well.
 */
var constructorType2TS = function (n) {
    var id = toPrim((0, exports.identifierOrConstructor2TS)(n.id));
    return (n.typeParameters.length > 0) ?
        id + (0, exports.typeParameters2TS)(n.typeParameters) : id;
};
exports.constructorType2TS = constructorType2TS;
/**
 * functionType2TS
 */
var functionType2TS = function (n) {
    var params = n.parameters.map(function (t, k) { return "$".concat(k, ":").concat((0, exports.type2TS)(t)); }).join(',');
    var ret = (0, exports.type2TS)(n.returnType);
    return "(".concat(params, ") => ").concat(ret);
};
exports.functionType2TS = functionType2TS;
/**
 * listType2TS
 */
var listType2TS = function (n) {
    return "(".concat((0, exports.type2TS)(n.elementType), ")[]");
};
exports.listType2TS = listType2TS;
/**
 * tupleType2TS
 */
var tupleType2TS = function (n) {
    return "[".concat(n.members.map(exports.type2TS).join(','), "]");
};
exports.tupleType2TS = tupleType2TS;
/**
 * recordType2TS converts the RecordType node to the body of a TypeScript
 * record interface.
 */
var recordType2Ts = function (n) {
    return '{' + (0, exports.memberDeclarations2TS)(n.members) + '}';
};
exports.recordType2Ts = recordType2Ts;
/**
 * memberDeclarations2TS converts a list of MemberDeclarations to TypeScript.
 *
 * The paths of the MemberDeclarations are expanded so that paths
 * using the "<path1>.<path2>.<path3>" syntax occur as nested records.
 */
var memberDeclarations2TS = function (n) {
    return (0, exports.typeMap2TS)((0, exports.expandTypeMap)((0, exports.typeMapFromMemberDecs)(n)));
};
exports.memberDeclarations2TS = memberDeclarations2TS;
/**
 * typeMapFromMemberDecs creates a TypeMap from a list of memberDeclarations.
 *
 * This works recursively and any RecordTypes encountered will be flattened.
 */
var typeMapFromMemberDecs = function (list) {
    return list.reduce(function (p, m) {
        var paths = m.path.map(function (p) { return p.value; });
        if (m.kind instanceof ast.RecordType) {
            return (0, exports.typeMapFromRecordType)(m.kind, p, paths);
        }
        else {
            var path = paths2String(paths);
            path = m.optional ? "".concat(path, "?") : path;
            p[path] = m.kind;
            return p;
        }
    }, {});
};
exports.typeMapFromMemberDecs = typeMapFromMemberDecs;
/**
 * typeMapFromRecordType produces a map of node.Type instances from
 * a RecordType recursively.
 *
 * Any encountered RecordTypes will be flattened.
 */
var typeMapFromRecordType = function (n, init, prefix) {
    return n.members.reduce(function (p, m) {
        var path = __spreadArray(__spreadArray([], prefix, true), (m.path.map(function (p) { return p.value; })), true);
        if (m.kind instanceof ast.RecordType) {
            return (0, exports.typeMapFromRecordType)(m.kind, init, path);
        }
        else {
            p[paths2String(path)] = m.kind;
            return p;
        }
    }, init);
};
exports.typeMapFromRecordType = typeMapFromRecordType;
var paths2String = function (paths) { return paths.join('.'); };
/**
 * expandTypeMap to an ExpandedTypeMap.
 */
var expandTypeMap = function (m) {
    return (0, record_1.reduce)(m, {}, function (p, c, k) {
        return (0, path_1.set)(k, (0, exports.type2TS)(c), p);
    });
};
exports.expandTypeMap = expandTypeMap;
/**
 * typeMap2TS converts a map of type values to TypeScript.
 */
var typeMap2TS = function (m) {
    return (0, record_1.mapTo)(m, function (t, k) {
        if ((0, record_1.isRecord)(t)) {
            var key = isOptional(t) ? "".concat(k, "?") : "".concat(k);
            return "".concat(key, ": {").concat((0, exports.typeMap2TS)(t), "}");
        }
        else {
            return "".concat(k, " : ").concat(t);
        }
    }).join(',\n');
};
exports.typeMap2TS = typeMap2TS;
var isOptional = function (m) {
    return (0, record_1.reduce)(m, false, function (p, _, k) { return p ? p : k.indexOf('?') > -1; });
};
/**
 * parameters2TS converts a list Parameter nodes into an parameter list
 * (without parens).
 */
var parameters2TS = function (list) {
    return list.map(function (p) { return (0, exports.parameter2TS)(p); }).join(',');
};
exports.parameters2TS = parameters2TS;
/**
 * parameter2TS
 */
var parameter2TS = function (n) {
    if (n instanceof ast.TypedParameter)
        return (0, exports.typedParameter2TS)(n);
    else if (n instanceof ast.UntypedParameter)
        return (0, exports.untypedParameter2TS)(n);
    else
        return '';
};
exports.parameter2TS = parameter2TS;
/**
 * typedParameter2TS
 */
var typedParameter2TS = function (n) {
    return "".concat((0, exports.identifier2TS)(n.id), ": ").concat((0, exports.type2TS)(n.hint), " ");
};
exports.typedParameter2TS = typedParameter2TS;
/**
 * untypedParameter2TS
 */
var untypedParameter2TS = function (n) {
    return "".concat((0, exports.identifier2TS)(n.id), " ");
};
exports.untypedParameter2TS = untypedParameter2TS;
/**
 * children2TS
 */
var children2TS = function (ctx, list) {
    return "[".concat(ctx.options.EOL, "\n        ").concat(list.map(function (l) { return (0, exports.child2TS)(ctx, l); }).join(',' + ctx.options.EOL), "\n     ]");
};
exports.children2TS = children2TS;
/**
 * child2TS converts children to typescript.
 */
var child2TS = function (ctx, n) {
    if ((n instanceof ast.Node) || (n instanceof ast.Widget))
        return (0, exports.tag2TS)(ctx, n);
    else if (n instanceof ast.Interpolation)
        return (0, exports.interpolation2TS)(ctx, n);
    else if (n instanceof ast.IfStatement)
        return (0, exports.ifStatement2TS)(ctx, n);
    else if (n instanceof ast.ForInStatement)
        return (0, exports.forInStatement2TS)(ctx, n);
    else if (n instanceof ast.ForOfStatement)
        return (0, exports.forOfStatement2TS)(ctx, n);
    else if (n instanceof ast.Characters)
        return (0, exports.characters2TS)(n);
    else if (n instanceof ast.ContextProperty)
        return (0, exports.contextProperty2TS)(n);
    else if (n instanceof ast.QualifiedConstructor)
        return (0, exports.qualifiedConstructor2TS)(n);
    else if (n instanceof ast.UnqualifiedConstructor)
        return (0, exports.unqualifiedConstructor2TS)(n);
    else if (n instanceof ast.UnqualifiedIdentifier)
        return (0, exports.unqualifiedIdentifier2TS)(n);
    else if (n instanceof ast.QualifiedIdentifier)
        return (0, exports.qualifiedIdentifier2TS)(n);
    else
        return '';
};
exports.child2TS = child2TS;
/**
 * tag2TS converts a tag to typescript.
 */
var tag2TS = function (ctx, n) { return (n.type === 'widget') ?
    (0, exports.widget2TS)(ctx, n) : (0, exports.node2TS)(ctx, n); };
exports.tag2TS = tag2TS;
/**
 * widget2TS converts a Widget node into its typescript representation.
 *
 * This is simply a call to the View's widget method.
 */
var widget2TS = function (ctx, n) {
    var name = (0, exports.constructor2TS)(n.open);
    var attrs = (0, exports.attrs2String)((0, exports.groupAttrs)(ctx, n.attributes));
    var childs = (0, exports.children2TS)(ctx, n.children);
    return "".concat(exports.THIS, ".widget(new ").concat(name, "(").concat(attrs, ", ").concat(childs, "),") +
        "<".concat(exports.WML, ".Attrs>").concat(attrs, ")");
};
exports.widget2TS = widget2TS;
/**
 * node2TS converts a Node into its typescript representation.
 *
 * This is simply a call to the View's node method.
 */
var node2TS = function (ctx, n) {
    var name = (0, exports.identifier2TS)(n.open);
    var attrs = (0, exports.attrs2String)((0, exports.groupAttrs)(ctx, n.attributes));
    var childs = (0, exports.children2TS)(ctx, n.children);
    return "".concat(exports.THIS, ".node('").concat(name, "', <").concat(exports.WML, ".Attrs>").concat(attrs, ", ").concat(childs, ")");
};
exports.node2TS = node2TS;
/**
 * attribute2Value
 */
var attribute2TS = function (ctx, n) {
    return "".concat((0, exports.attributeName2TS)(ctx, n), " : ").concat((0, exports.attributeValue2TS)(ctx, n), " ");
};
exports.attribute2TS = attribute2TS;
/**
 * attributeValue2TS
 */
var attributeValue2TS = function (ctx, n) {
    return (n.value instanceof ast.Interpolation) ?
        (0, exports.interpolation2TS)(ctx, n.value) :
        (0, exports.literal2TS)(ctx, n.value);
};
exports.attributeValue2TS = attributeValue2TS;
/**
 * attributeName2TS
 */
var attributeName2TS = function (_, n) {
    return "'".concat((0, exports.unqualifiedIdentifier2TS)(n.name), "'");
};
exports.attributeName2TS = attributeName2TS;
/**
 * attrs2String
 */
var attrs2String = function (attrs) {
    return '{' +
        Object.keys(attrs).map(function (name) {
            return Array.isArray(attrs[name]) ?
                "".concat(name, " : { ").concat(attrs[name].join(','), " }") :
                "".concat(name, ": ").concat(attrs[name]);
        }) +
        '}';
};
exports.attrs2String = attrs2String;
/**
 * groupAttrs
 */
var groupAttrs = function (ctx, attrs) {
    var _a = (0, array_1.partition)(attrs, function (a) { return (a.namespace.value === ''); }), nns = _a[0], ns = _a[1];
    var nso = ns.reduce(function (p, n) {
        var _a;
        return (0, record_1.merge)(p, (_a = {},
            _a[n.namespace.value] = (p[n.namespace.value] || []).concat((0, exports.attribute2TS)(ctx, n)),
            _a));
    }, {});
    return nns.reduce(function (p, n) {
        var _a;
        return (0, record_1.merge)(p, (_a = {},
            _a[(0, exports.attributeName2TS)(ctx, n)] = (0, exports.attributeValue2TS)(ctx, n),
            _a));
    }, nso);
};
exports.groupAttrs = groupAttrs;
/**
 * interpolation2TS
 */
var interpolation2TS = function (ctx, n) {
    return n.filters.reduce(function (p, c) {
        return "".concat((0, exports.expression2TS)(ctx, c), " (").concat(p, ")");
    }, (0, exports.expression2TS)(ctx, n.expression));
};
exports.interpolation2TS = interpolation2TS;
/**
 * ifStatementTS converts an IfStatement to its typescript representation.
 */
var ifStatement2TS = function (ctx, n) {
    var condition = (0, exports.expression2TS)(ctx, n.condition);
    var conseq = (0, exports.children2TS)(ctx, n.then);
    var alt = (n.elseClause instanceof ast.ElseIfClause) ?
        "[".concat((0, exports.ifStatement2TS)(ctx, n.elseClause), "]") :
        (n.elseClause instanceof ast.ElseClause) ?
            (0, exports.children2TS)(ctx, n.elseClause.children) :
            '[]';
    return [
        "...((".concat(condition, ") ?"),
        "(()=>(".concat(conseq, "))() :"),
        "(()=>(".concat(alt, "))())")
    ].join(ctx.options.EOL);
};
exports.ifStatement2TS = ifStatement2TS;
/**
 * forInStatement2TS converts a ForInStatement to its typescript representation.
 */
var forInStatement2TS = function (ctx, n) {
    var expr = (0, exports.expression2TS)(ctx, n.expression);
    var value = (0, exports.parameter2TS)(n.variables[0]);
    var key = n.variables.length > 1 ? (0, exports.parameter2TS)(n.variables[1]) : '_$$i';
    var all = n.variables.length > 2 ? (0, exports.parameter2TS)(n.variables[2]) : '_$$all';
    var body = (0, exports.children2TS)(ctx, n.body);
    var alt = n.otherwise.length > 0 ? (0, exports.children2TS)(ctx, n.otherwise) : '[]';
    return [
        "...".concat(FOR_IN, " (").concat(expr, ", (").concat(value, ", ").concat(key, ", ").concat(all, ")=> "),
        "(".concat(body, "), "),
        "()=> (".concat(alt, "))")
    ].join(ctx.options.EOL);
};
exports.forInStatement2TS = forInStatement2TS;
/**
 * forOfStatement2TS
 */
var forOfStatement2TS = function (ctx, n) {
    var expr = (0, exports.expression2TS)(ctx, n.expression);
    var value = (0, exports.parameter2TS)(n.variables[0]);
    var key = n.variables.length > 1 ? (0, exports.parameter2TS)(n.variables[1]) : '_$$k';
    var all = n.variables.length > 2 ? (0, exports.parameter2TS)(n.variables[2]) : '_$$all';
    var body = (0, exports.children2TS)(ctx, n.body);
    var alt = n.otherwise.length > 0 ? (0, exports.children2TS)(ctx, n.otherwise) : '[]';
    return [
        "...".concat(FOR_OF, " (").concat(expr, ", (").concat(value, ", ").concat(key, ", ").concat(all, ") => "),
        "       (".concat(body, "), "),
        "    ()=> (".concat(alt, "))")
    ].join(eol(ctx));
};
exports.forOfStatement2TS = forOfStatement2TS;
/**
 * characters2TS converts character text to a typescript string.
 */
var characters2TS = function (n) {
    return "".concat(exports.DOCUMENT, ".createTextNode('").concat(breakLines(n.value), "')");
};
exports.characters2TS = characters2TS;
var breakLines = function (str) { return str.split('\n').join('\\u000a'); };
/**
 * expression2TS
 */
var expression2TS = function (ctx, n) {
    if (n instanceof ast.IfThenExpression)
        return (0, exports.ifThenExpression2TS)(ctx, n);
    else if (n instanceof ast.BinaryExpression)
        return (0, exports.binaryExpression2TS)(ctx, n);
    else if (n instanceof ast.UnaryExpression)
        return (0, exports.unaryExpression2TS)(ctx, n);
    else if (n instanceof ast.TypeAssertion)
        return (0, exports.typeAssertion2TS)(ctx, n);
    else if (n instanceof ast.ViewConstruction)
        return (0, exports.viewConstruction2TS)(ctx, n);
    else if (n instanceof ast.FunApplication)
        return (0, exports.funApplication2TS)(ctx, n);
    else if (n instanceof ast.ConstructExpression)
        return (0, exports.constructExpression2TS)(ctx, n);
    else if (n instanceof ast.CallExpression)
        return (0, exports.callExpression2TS)(ctx, n);
    else if (n instanceof ast.MemberExpression)
        return (0, exports.memberExpression2TS)(ctx, n);
    else if (n instanceof ast.FunctionExpression)
        return (0, exports.functionExpression2TS)(ctx, n);
    else if (n instanceof ast.Record)
        return (0, exports.record2TS)(ctx, n);
    else if (n instanceof ast.List)
        return (0, exports.list2TS)(ctx, n);
    else if (n instanceof ast.BooleanLiteral)
        return (0, exports.boolean2TS)(n);
    else if (n instanceof ast.NumberLiteral)
        return (0, exports.number2TS)(n);
    else if (n instanceof ast.StringLiteral)
        return (0, exports.string2TS)(n);
    else if (n instanceof ast.ContextProperty)
        return (0, exports.contextProperty2TS)(n);
    else if (n instanceof ast.QualifiedConstructor)
        return (0, exports.qualifiedConstructor2TS)(n);
    else if (n instanceof ast.UnqualifiedConstructor)
        return (0, exports.unqualifiedConstructor2TS)(n);
    else if (n instanceof ast.UnqualifiedIdentifier)
        return (0, exports.unqualifiedIdentifier2TS)(n);
    else if (n instanceof ast.QualifiedIdentifier)
        return (0, exports.qualifiedIdentifier2TS)(n);
    else if (n instanceof ast.ContextVariable)
        return (0, exports.contextVariable2TS)(n);
    else
        return '';
};
exports.expression2TS = expression2TS;
/**
 * ifThenExpression2TS
 */
var ifThenExpression2TS = function (ctx, n) {
    var condition = (0, exports.expression2TS)(ctx, n.condition);
    var conseq = (0, exports.expression2TS)(ctx, n.iftrue);
    var alt = (0, exports.expression2TS)(ctx, n.iffalse);
    return "(".concat(condition, ") ? ").concat(conseq, " :  ").concat(alt);
};
exports.ifThenExpression2TS = ifThenExpression2TS;
/**
 * binaryExpression2TS
 */
var binaryExpression2TS = function (ctx, n) {
    var left = (0, exports.expression2TS)(ctx, n.left);
    var right = (0, exports.expression2TS)(ctx, n.right);
    var op = operators.hasOwnProperty(n.operator) ?
        operators[n.operator] :
        n.operator;
    return "(".concat(left, " ").concat(op, " ").concat(right, ")");
};
exports.binaryExpression2TS = binaryExpression2TS;
/**
 * unaryExpression2TS
 */
var unaryExpression2TS = function (ctx, n) {
    var expr = (0, exports.expression2TS)(ctx, n.expression);
    return (n.operator === '??') ?
        "(".concat(expr, ") != null") :
        "".concat(n.operator, "(").concat(expr, ")");
};
exports.unaryExpression2TS = unaryExpression2TS;
/**
 * typeAssertion2TS
 */
var typeAssertion2TS = function (ctx, n) {
    return "<".concat((0, exports.type2TS)(n.target), ">(").concat((0, exports.expression2TS)(ctx, n.expression), ")");
};
exports.typeAssertion2TS = typeAssertion2TS;
/**
 * viewConstruction2TS
 */
var viewConstruction2TS = function (ctx, n) {
    return "".concat(exports.THIS, ".registerView(").concat((0, exports.expression2TS)(ctx, n.expression), ").render()");
};
exports.viewConstruction2TS = viewConstruction2TS;
/**
 * funApplication2TS
 */
var funApplication2TS = function (ctx, n) {
    return "".concat((0, exports.expression2TS)(ctx, n.target)).concat((0, exports.typeArgs2TS)(n.typeArgs), " ") +
        "(".concat((0, exports.args2TS)(ctx, n.args), ")(").concat(exports.THIS, ")");
};
exports.funApplication2TS = funApplication2TS;
/**
 * constructExpression2TS
 */
var constructExpression2TS = function (ctx, n) {
    var cons = (0, exports.constructor2TS)(n.cons);
    var consOriginal = "".concat(cons[0].toUpperCase()).concat(cons.slice(1));
    var args = (0, exports.args2TS)(ctx, n.args);
    if ((0, array_1.contains)(casters, consOriginal)) {
        return "".concat(consOriginal, "(").concat(args, ")");
    }
    else {
        return "new ".concat(cons, "(").concat(args, ")");
    }
};
exports.constructExpression2TS = constructExpression2TS;
/**
 * callExpression2TS
 */
var callExpression2TS = function (ctx, n) {
    var target = (0, exports.expression2TS)(ctx, n.target);
    var typeArgs = (0, exports.typeArgs2TS)(n.typeArgs);
    var args = (0, exports.args2TS)(ctx, n.args);
    return "".concat(target).concat(typeArgs, "(").concat(args, ")");
};
exports.callExpression2TS = callExpression2TS;
/**
 * typeArgs2TS
 */
var typeArgs2TS = function (ns) {
    return ns.length === 0 ? '' : "<".concat(ns.map(exports.type2TS).join(','), ">");
};
exports.typeArgs2TS = typeArgs2TS;
/**
 * args2TS converts a list of arguments to a typescript argument tupple.
 */
var args2TS = function (ctx, ns) {
    return (ns.length === 0) ? '' : ns.map(function (e) { return (0, exports.expression2TS)(ctx, e); }).join(',');
};
exports.args2TS = args2TS;
/**
 * memberExpression2TS
 */
var memberExpression2TS = function (ctx, n) {
    var target = (0, exports.expression2TS)(ctx, n.target);
    return (n.member instanceof ast.StringLiteral) ?
        "".concat(target, "[").concat((0, exports.string2TS)(n.member), "]") :
        "".concat(target, ".").concat((0, exports.identifier2TS)(n.member));
};
exports.memberExpression2TS = memberExpression2TS;
/**
 * functionExpression2TS
 */
var functionExpression2TS = function (ctx, n) {
    var params = n.parameters.map(exports.parameter2TS).join(',');
    var body = (0, exports.expression2TS)(ctx, n.body);
    return "(".concat(params, ") => ").concat(body);
};
exports.functionExpression2TS = functionExpression2TS;
/**
 * literal2TS
 */
var literal2TS = function (ctx, n) {
    if (n instanceof ast.BooleanLiteral)
        return (0, exports.boolean2TS)(n);
    else if (n instanceof ast.StringLiteral)
        return (0, exports.string2TS)(n);
    else if (n instanceof ast.NumberLiteral)
        return (0, exports.number2TS)(n);
    else if (n instanceof ast.Record)
        return (0, exports.record2TS)(ctx, n);
    else if (n instanceof ast.List)
        return (0, exports.list2TS)(ctx, n);
    else
        return '';
};
exports.literal2TS = literal2TS;
/**
 * boolean2TS
 */
var boolean2TS = function (n) { return "".concat(n.value, " "); };
exports.boolean2TS = boolean2TS;
/**
 * string2TS
 */
var string2TS = function (n) { return "'".concat(n.value, "'"); };
exports.string2TS = string2TS;
/**
 * number2TS
 */
var number2TS = function (n) { return "".concat(parseFloat(n.value)); };
exports.number2TS = number2TS;
/**
 * record2TS
 */
var record2TS = function (ctx, n) {
    return "{".concat(ctx.options.EOL, " \n      ").concat(n.properties.map(function (p) { return (0, exports.property2TS)(ctx, p); }).join(',' + ctx.options.EOL), "\n     }");
};
exports.record2TS = record2TS;
/**
 * list2TS
 */
var list2TS = function (ctx, n) {
    var mems = n.members.map(function (e) { return (0, exports.expression2TS)(ctx, e); });
    return "[".concat(ctx.options.EOL, "\n            ").concat(mems.join(',' + ctx.options.EOL), "\n            ]");
};
exports.list2TS = list2TS;
/**
 * property2TS
 */
var property2TS = function (ctx, n) {
    return "'".concat((0, exports.key2TS)(n.key), "' : ").concat((0, exports.expression2TS)(ctx, n.value));
};
exports.property2TS = property2TS;
/**
 * key2TS
 */
var key2TS = function (n) {
    return (n instanceof ast.StringLiteral) ? (0, exports.string2TS)(n) : (0, exports.identifier2TS)(n);
};
exports.key2TS = key2TS;
/**
 * contextProperty2TS
 */
var contextProperty2TS = function (n) {
    var member = (n.member instanceof ast.StringLiteral) ?
        n.member.value :
        (0, exports.identifier2TS)(n.member);
    return "".concat(exports.CONTEXT, ".").concat(member);
};
exports.contextProperty2TS = contextProperty2TS;
/**
 * contextVariable2TS
 */
var contextVariable2TS = function (_) { return "".concat(exports.CONTEXT); };
exports.contextVariable2TS = contextVariable2TS;
/**
 * identifierOrConstructor2TS
 */
var identifierOrConstructor2TS = function (n) {
    if ((n instanceof ast.UnqualifiedIdentifier) ||
        (n instanceof ast.QualifiedIdentifier))
        return (0, exports.identifier2TS)(n);
    else if ((n instanceof ast.UnqualifiedConstructor) ||
        (n instanceof ast.QualifiedConstructor))
        return (0, exports.constructor2TS)(n);
    else
        return '';
};
exports.identifierOrConstructor2TS = identifierOrConstructor2TS;
/**
 * constructor2TS
 */
var constructor2TS = function (n) {
    if (n instanceof ast.QualifiedConstructor)
        return (0, exports.qualifiedConstructor2TS)(n);
    else if (n instanceof ast.UnqualifiedConstructor)
        return (0, exports.unqualifiedConstructor2TS)(n);
    else
        return '';
};
exports.constructor2TS = constructor2TS;
/**
 * unqualifiedConstructor2TS
 */
var unqualifiedConstructor2TS = function (n) {
    return toPrim(n.value);
};
exports.unqualifiedConstructor2TS = unqualifiedConstructor2TS;
/**
 * qualifiedConstructor
 */
var qualifiedConstructor2TS = function (n) {
    return "".concat(n.qualifier, ".").concat(n.member);
};
exports.qualifiedConstructor2TS = qualifiedConstructor2TS;
/**
 * identifier2TS
 */
var identifier2TS = function (n) {
    if (n instanceof ast.QualifiedIdentifier)
        return (0, exports.qualifiedIdentifier2TS)(n);
    else if (n instanceof ast.UnqualifiedIdentifier)
        return (0, exports.unqualifiedIdentifier2TS)(n);
    else
        return '';
};
exports.identifier2TS = identifier2TS;
/**
 * qualifiedIdentifier2TS
 */
var qualifiedIdentifier2TS = function (n) {
    return "".concat(n.qualifier, ".").concat(n.member);
};
exports.qualifiedIdentifier2TS = qualifiedIdentifier2TS;
/**
 * unqualifiedIdentifier2TS
 */
var unqualifiedIdentifier2TS = function (n) {
    return "".concat(toPrim(n.value));
};
exports.unqualifiedIdentifier2TS = unqualifiedIdentifier2TS;
var toPrim = function (id) { return prims.indexOf(id) > -1 ? id.toLowerCase() : id; };
//# sourceMappingURL=codegen.js.map