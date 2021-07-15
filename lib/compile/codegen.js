"use strict";
/**
 * Typescript code generator.
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forOfStatement2TS = exports.forInStatement2TS = exports.ifStatement2TS = exports.interpolation2TS = exports.groupAttrs = exports.attrs2String = exports.attributeName2TS = exports.attributeValue2TS = exports.attribute2TS = exports.node2TS = exports.widget2TS = exports.tag2TS = exports.child2TS = exports.children2TS = exports.untypedParameter2TS = exports.typedParameter2TS = exports.parameter2TS = exports.parameters2TS = exports.typeMap2TS = exports.expandTypeMap = exports.typeMapFromRecordType = exports.typeMapFromMemberDecs = exports.memberDeclarations2TS = exports.recordType2Ts = exports.tupleType2TS = exports.listType2TS = exports.functionType2TS = exports.constructorType2TS = exports.type2TS = exports.typeParameter2TS = exports.typeParameters2TS = exports.viewStatement2TS = exports.funStatement2TS = exports.instanceStatement2TS = exports.contractStatement2TS = exports.aliasStatement2TS = exports.export2TS = exports.exports2TS = exports.compositeMember2TS = exports.aliasedMember2TS = exports.aggregateMember2TS = exports.importMember2TS = exports.importStatement2TS = exports.importStatements2TS = exports.CodeGenerator = exports.THIS = exports.DOCUMENT = exports.WML = exports.VIEW = exports.CONTEXT = void 0;
exports.unqualifiedIdentifier2TS = exports.qualifiedIdentifier2TS = exports.identifier2TS = exports.qualifiedConstructor2TS = exports.unqualifiedConstructor2TS = exports.constructor2TS = exports.identifierOrConstructor2TS = exports.contextVariable2TS = exports.contextProperty2TS = exports.key2TS = exports.property2TS = exports.list2TS = exports.record2TS = exports.number2TS = exports.string2TS = exports.boolean2TS = exports.literal2TS = exports.functionExpression2TS = exports.memberExpression2TS = exports.args2TS = exports.typeArgs2TS = exports.callExpression2TS = exports.constructExpression2TS = exports.funApplication2TS = exports.viewConstruction2TS = exports.typeAssertion2TS = exports.unaryExpression2TS = exports.binaryExpression2TS = exports.ifThenExpression2TS = exports.expression2TS = exports.characters2TS = void 0;
/** imports */
var ast = require("../parse/ast");
var path_1 = require("@quenk/noni/lib/data/record/path");
var record_1 = require("@quenk/noni/lib/data/record");
var array_1 = require("@quenk/noni/lib/data/array");
exports.CONTEXT = '__context';
exports.VIEW = '__view';
exports.WML = '__wml';
exports.DOCUMENT = '__document';
exports.THIS = '__this';
var MAYBE = '__Maybe';
var FROM_NULLABLE = '__fromNullable';
var FROM_ARRAY = '__fromArray';
var NODE_PARAMS = "tag:string, attrs:" + exports.WML + ".Attrs, " +
    ("children: " + exports.WML + ".Content[]");
var WIDGET_PARAMS = "w: " + exports.WML + ".Widget, attrs:" + exports.WML + ".Attrs";
var REGISTER_VIEW_PARAMS = "v:" + exports.WML + ".View";
var REGISTER_PARAMS = "e:" + exports.WML + ".WMLElement, " +
    ("attrs:" + exports.WML + ".Attributes<any>");
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
    CodeGenerator.prototype.generate = function (m) {
        return [
            "import * as " + exports.WML + " from '" + this.options.module + "';",
            "import * as " + exports.DOCUMENT + " from '" + this.options.dom + "';",
            imports(this),
            exports.importStatements2TS(this, m.imports),
            eol(this),
            typeDefinitions(this),
            eol(this),
            "// @ts-ignore 6192",
            "const text = " + exports.DOCUMENT + ".text;",
            "// @ts-ignore 6192",
            "const isSet = (value:any) => value != null",
            exports.exports2TS(this, m.exports)
        ].join(eol(this));
    };
    return CodeGenerator;
}());
exports.CodeGenerator = CodeGenerator;
var eol = function (ctx) { return "" + ctx.options.EOL; };
var imports = function (ctx) { return [
    "//@ts-ignore: 6192",
    "import {",
    "Maybe as " + MAYBE + ",",
    "fromNullable as " + FROM_NULLABLE + ",",
    "fromArray as " + FROM_ARRAY,
    "}",
    "from '@quenk/noni/lib/data/maybe';"
].join(eol(ctx)); };
var typeDefinitions = function (ctx) { return [
    "" + IGNORE_UNUSED,
    "type " + IFARG + " = ()=>" + exports.WML + ".Content[]",
    "",
    "" + IGNORE_UNUSED,
    "type " + FOR_ALT_TYPE + " = ()=> " + exports.WML + ".Content[]",
    "",
    "" + IGNORE_UNUSED,
    "type " + FOR_IN_BODY + " =(val:A, idx:number, all:A[])=>" +
        (exports.WML + ".Content[]"),
    "",
    "" + IGNORE_UNUSED,
    "type " + FOR_OF_BODY + " = (val:A, key:string, all:object) =>" +
        (exports.WML + ".Content[]"),
    "",
    "" + IGNORE_UNUSED,
    "interface " + RECORD + " {",
    "",
    " [key:string]: A",
    "",
    "}",
    "",
    "" + IGNORE_UNUSED,
    "const " + IF + " = (__expr:boolean, __conseq:" + IFARG + ",__alt?:" + IFARG + ") " +
        ": Content[]=>",
    "(__expr) ? __conseq() :  __alt ? __alt() : [];",
    "",
    "" + IGNORE_UNUSED,
    "const " + FOR_IN + " = <A>(list:A[], f:" + FOR_IN_BODY + ", alt:" +
        (FOR_ALT_TYPE + ") : " + exports.WML + ".Content[] => {"),
    "",
    "   let ret:" + exports.WML + ".Content[] = [];",
    "",
    "   for(let i=0; i<list.length; i++)",
    "       ret = ret.concat(f(list[i], i, list));",
    "",
    "   return ret.length === 0 ? alt() : ret;",
    "",
    "}",
    "" + IGNORE_UNUSED,
    "const " + FOR_OF + " = <A>(o:" + RECORD + ", f:" + FOR_OF_BODY + "," +
        ("alt:" + FOR_ALT_TYPE + ") : " + exports.WML + ".Content[] => {"),
    "",
    "    let ret:" + exports.WML + ".Content[] = [];",
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
    return list.map(exports.importStatement2TS).join(";" + eol(ctx));
};
exports.importStatements2TS = importStatements2TS;
/**
 * importStatement2TS
 */
var importStatement2TS = function (n) {
    return "import " + exports.importMember2TS(n.member) + " from '" + n.module.value + "'; ";
};
exports.importStatement2TS = importStatement2TS;
/**
 * importMember2TS
 */
var importMember2TS = function (n) {
    if (n instanceof ast.AggregateMember)
        return exports.aggregateMember2TS(n);
    else if (n instanceof ast.AliasedMember)
        return exports.aliasedMember2TS(n);
    else if (n instanceof ast.CompositeMember)
        return exports.compositeMember2TS(n);
    else
        return '';
};
exports.importMember2TS = importMember2TS;
/**
 * aggregateMember2TS
 */
var aggregateMember2TS = function (n) {
    return "* as " + exports.identifierOrConstructor2TS(n.id) + " ";
};
exports.aggregateMember2TS = aggregateMember2TS;
/**
 * aliasedMember2TS
 */
var aliasedMember2TS = function (n) {
    return exports.identifierOrConstructor2TS(n.member) + " " +
        ("as " + exports.identifierOrConstructor2TS(n.alias) + " ");
};
exports.aliasedMember2TS = aliasedMember2TS;
/**
 * compositeMember2TS
 */
var compositeMember2TS = function (n) {
    return '{' + (n.members.map(function (m) { return (m instanceof ast.AliasedMember) ?
        exports.aliasedMember2TS(m) :
        exports.identifierOrConstructor2TS(m); }).join(',')) + '}';
};
exports.compositeMember2TS = compositeMember2TS;
/**
 * exports2TS converts a list of exports to typescript.
 */
var exports2TS = function (ctx, list) {
    return list.map(function (e) { return exports.export2TS(ctx, e); }).join(';' + eol(ctx));
};
exports.exports2TS = exports2TS;
/**
 * export2TS
 */
var export2TS = function (ctx, n) {
    if (n instanceof ast.AliasStatement)
        return exports.aliasStatement2TS(n);
    else if (n instanceof ast.ContractStatement)
        return exports.contractStatement2TS(n);
    else if (n instanceof ast.InstanceStatement)
        return exports.instanceStatement2TS(ctx, n);
    else if (n instanceof ast.FunStatement)
        return exports.funStatement2TS(ctx, n);
    else if (n instanceof ast.ViewStatement)
        return exports.viewStatement2TS(ctx, n);
    else if ((n instanceof ast.Widget) || (n instanceof ast.Node))
        return exports.tag2TS(ctx, n);
    else
        return '';
};
exports.export2TS = export2TS;
/**
 * aliasStatement2TS
 */
var aliasStatement2TS = function (n) {
    var typeArgs = (n.typeParameters.length > 0) ?
        exports.typeParameters2TS(n.typeParameters) : '';
    var preamble = "export type " + n.id.value + typeArgs;
    var members = n.members.map(function (m) { return exports.type2TS(m); }).join('|');
    return preamble + " = " + members + ";";
};
exports.aliasStatement2TS = aliasStatement2TS;
/**
 * contractStatement2TS
 */
var contractStatement2TS = function (n) {
    var preamble = "export interface " + n.id.value;
    var typeArgs = (n.typeParameters.length > 0) ?
        exports.typeParameters2TS(n.typeParameters) : '';
    var parents = n.parents.map(exports.constructorType2TS).join(',');
    parents = (parents !== '') ? " extends " + parents : '';
    return [preamble, typeArgs, parents, '{', exports.memberDeclarations2TS(n.members),
        '}'].join('');
};
exports.contractStatement2TS = contractStatement2TS;
/**
 * instanceStatement2TS
 */
var instanceStatement2TS = function (ctx, n) {
    return _instanceStatement2TS(ctx, n, 'export const');
};
exports.instanceStatement2TS = instanceStatement2TS;
var _instanceStatement2TS = function (ctx, n, preamble) {
    var id = exports.identifier2TS(n.id);
    var cons = exports.constructorType2TS(n.cons);
    preamble = preamble + " " + id + ":" + cons;
    var props = n.properties.map(function (prop) { return exports.property2TS(ctx, prop); }).join(',');
    return preamble + " = " + props;
};
/**
 * funStatement2TS generates Typescript output for fun statements.
 *
 * This is a curried function that first accepts zero or more arguments then
 * a single Registry, finally the content.
 */
var funStatement2TS = function (ctx, n) {
    var id = exports.unqualifiedIdentifier2TS(n.id);
    var typeParams = exports.typeParameters2TS(n.typeParameters);
    var params = exports.parameters2TS(n.parameters);
    var factory = "(" + exports.THIS + ":" + exports.WML + ".Registry) : " + exports.WML + ".Content[] =>";
    var body = exports.children2TS(ctx, n.body);
    return [
        "export const " + id + " = ",
        "",
        typeParams + "(" + params + ")=>" + factory + " {",
        "",
        "   return " + body + ";",
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
    var instances = n.instances.map(function (i) {
        return _instanceStatement2TS(ctx, i, 'let');
    }).join(";" + ctx.options.EOL);
    var id = n.id ? exports.constructor2TS(n.id) : 'Main';
    var typeParams = exports.typeParameters2TS(n.typeParameters);
    var c = exports.type2TS(n.context);
    var template = exports.tag2TS(ctx, n.root);
    return [
        "export class " + id + " " + typeParams + " implements " + exports.WML + ".View {",
        "",
        "   constructor(" + exports.CONTEXT + ": " + c + ") {",
        "",
        "       this.template = (" + exports.THIS + ":" + exports.WML + ".Registry) => {",
        "",
        "       " + instances,
        "",
        "           return " + template + ";",
        "",
        "       }",
        "",
        "   }",
        "",
        "   ids: { [key: string]: " + exports.WML + ".WMLElement } = {};",
        "",
        "   groups: { [key: string]: " + exports.WML + ".WMLElement[] } = {};",
        "",
        "   views: " + exports.WML + ".View[] = [];",
        "",
        "   widgets: " + exports.WML + ".Widget[] = [];",
        "",
        "   tree: Node = <Node>" + exports.DOCUMENT + ".createElement('div');",
        "",
        "   template: " + exports.WML + ".Template;",
        "",
        "   registerView(" + REGISTER_VIEW_PARAMS + ") : " + exports.WML + ".View {",
        "",
        "       this.views.push(v);",
        "",
        "       return v;",
        "",
        "}",
        "   register(" + REGISTER_PARAMS + ") : " + exports.WML + ".WMLElement {",
        "",
        "       let attrsMap = (<" + exports.WML + ".Attrs><any>attrs)",
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
        "   node(" + NODE_PARAMS + "): " + exports.WML + ".Content {",
        "",
        "       let e = " + exports.DOCUMENT + ".createElement(tag);",
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
        "                     let tn = " + exports.DOCUMENT + ".createTextNode(''+c);",
        "                     e.appendChild(<Node>tn)",
        "                   case 'object':",
        "                       e.appendChild(<Node>c);",
        "                   break;",
        "                   default:",
        "                       " + THROW_CHILD_ERR,
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
        "   widget(" + WIDGET_PARAMS + ") : " + exports.WML + ".Content {",
        "",
        "       this.register(w, attrs);",
        "",
        "       this.widgets.push(w);",
        "",
        "       return w.render();",
        "",
        "   }",
        "",
        "   findById<E extends " + exports.WML + ".WMLElement>(id: string): " + MAYBE + "<E> {",
        "",
        "       let mW:" + MAYBE + "<E> = " + FROM_NULLABLE + "<E>(<E>this.ids[id])",
        "",
        "       return this.views.reduce((p,c)=>",
        "       p.isJust() ? p : c.findById(id), mW);",
        "",
        "   }",
        "",
        "   findByGroup<E extends " + exports.WML + ".WMLElement>(name: string): " +
            (MAYBE + "<E[]> {"),
        "",
        "      let mGroup:" + MAYBE + "<E[]> =",
        "           " + FROM_ARRAY + "(this.groups.hasOwnProperty(name) ?",
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
        "           " + THROW_INVALIDATE_ERR,
        "",
        "       parent.replaceChild(<Node>this.render(), tree) ",
        "",
        "   }",
        "",
        "   render(): " + exports.WML + ".Content {",
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
    return (ns.length === 0) ? '' : "<" + ns.map(exports.typeParameter2TS).join(',') + "> ";
};
exports.typeParameters2TS = typeParameters2TS;
/**
 * typeParameter2TS converts a type parameter into a typescript type parameter.
 */
var typeParameter2TS = function (n) {
    return toPrim(exports.identifierOrConstructor2TS(n.id)) + " " +
        ((n.constraint ? 'extends ' + exports.type2TS(n.constraint) : '') + " ");
};
exports.typeParameter2TS = typeParameter2TS;
/**
 * type2TS
 */
var type2TS = function (n) {
    if (n instanceof ast.ConstructorType)
        return exports.constructorType2TS(n);
    else if (n instanceof ast.RecordType)
        return exports.recordType2Ts(n);
    else if (n instanceof ast.ListType)
        return exports.listType2TS(n);
    else if (n instanceof ast.TupleType)
        return exports.tupleType2TS(n);
    else if (n instanceof ast.StringLiteral)
        return exports.string2TS(n);
    else if (n instanceof ast.NumberLiteral)
        return exports.number2TS(n);
    else if (n instanceof ast.BooleanLiteral)
        return exports.boolean2TS(n);
    else if (n instanceof ast.FunctionType)
        return exports.functionType2TS(n);
    return '<error>';
};
exports.type2TS = type2TS;
/**
 * constructorType2TS converts a ConstructorType into its id.
 *
 * If the node is generic, the type parameters will be generated as well.
 */
var constructorType2TS = function (n) {
    var id = toPrim(exports.identifierOrConstructor2TS(n.id));
    return (n.typeParameters.length > 0) ?
        id + exports.typeParameters2TS(n.typeParameters) : id;
};
exports.constructorType2TS = constructorType2TS;
/**
 * functionType2TS
 */
var functionType2TS = function (n) {
    var params = n.parameters.map(function (t, k) { return "$" + k + ":" + exports.type2TS(t); }).join(',');
    var ret = exports.type2TS(n.returnType);
    return "(" + params + ") => " + ret;
};
exports.functionType2TS = functionType2TS;
/**
 * listType2TS
 */
var listType2TS = function (n) {
    return "(" + exports.type2TS(n.elementType) + ")[]";
};
exports.listType2TS = listType2TS;
/**
 * tupleType2TS
 */
var tupleType2TS = function (n) {
    return "[" + n.members.map(exports.type2TS).join(',') + "]";
};
exports.tupleType2TS = tupleType2TS;
/**
 * recordType2TS converts the RecordType node to the body of a TypeScript
 * record interface.
 */
var recordType2Ts = function (n) {
    return '{' + exports.memberDeclarations2TS(n.members) + '}';
};
exports.recordType2Ts = recordType2Ts;
/**
 * memberDeclarations2TS converts a list of MemberDeclarations to TypeScript.
 *
 * The paths of the MemberDeclarations are expanded so that paths
 * using the "<path1>.<path2>.<path3>" syntax occur as nested records.
 */
var memberDeclarations2TS = function (n) {
    return exports.typeMap2TS(exports.expandTypeMap(exports.typeMapFromMemberDecs(n)));
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
            return exports.typeMapFromRecordType(m.kind, p, paths);
        }
        else {
            var path = paths2String(paths);
            path = m.optional ? path + "?" : path;
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
        var path = __spreadArray(__spreadArray([], prefix), (m.path.map(function (p) { return p.value; })));
        if (m.kind instanceof ast.RecordType) {
            return exports.typeMapFromRecordType(m.kind, init, path);
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
    return record_1.reduce(m, {}, function (p, c, k) {
        return path_1.set(k, exports.type2TS(c), p);
    });
};
exports.expandTypeMap = expandTypeMap;
/**
 * typeMap2TS converts a map of type values to TypeScript.
 */
var typeMap2TS = function (m) {
    return record_1.mapTo(m, function (t, k) {
        if (record_1.isRecord(t)) {
            var key = isOptional(t) ? k + "?" : "" + k;
            return key + ": {" + exports.typeMap2TS(t) + "}";
        }
        else {
            return k + " : " + t;
        }
    }).join(',\n');
};
exports.typeMap2TS = typeMap2TS;
var isOptional = function (m) {
    return record_1.reduce(m, false, function (p, _, k) { return p ? p : k.indexOf('?') > -1; });
};
/**
 * parameters2TS converts a list Parameter nodes into an parameter list
 * (without parens).
 */
var parameters2TS = function (list) {
    return list.map(function (p) { return exports.parameter2TS(p); }).join(',');
};
exports.parameters2TS = parameters2TS;
/**
 * parameter2TS
 */
var parameter2TS = function (n) {
    if (n instanceof ast.TypedParameter)
        return exports.typedParameter2TS(n);
    else if (n instanceof ast.UntypedParameter)
        return exports.untypedParameter2TS(n);
    else
        return '';
};
exports.parameter2TS = parameter2TS;
/**
 * typedParameter2TS
 */
var typedParameter2TS = function (n) {
    return exports.identifier2TS(n.id) + ": " + exports.type2TS(n.hint) + " ";
};
exports.typedParameter2TS = typedParameter2TS;
/**
 * untypedParameter2TS
 */
var untypedParameter2TS = function (n) {
    return exports.identifier2TS(n.id) + " ";
};
exports.untypedParameter2TS = untypedParameter2TS;
/**
 * children2TS
 */
var children2TS = function (ctx, list) {
    return "[" + ctx.options.EOL + "\n        " + list.map(function (l) { return exports.child2TS(ctx, l); }).join(',' + ctx.options.EOL) + "\n     ]";
};
exports.children2TS = children2TS;
/**
 * child2TS converts children to typescript.
 */
var child2TS = function (ctx, n) {
    if ((n instanceof ast.Node) || (n instanceof ast.Widget))
        return exports.tag2TS(ctx, n);
    else if (n instanceof ast.Interpolation)
        return exports.interpolation2TS(ctx, n);
    else if (n instanceof ast.IfStatement)
        return exports.ifStatement2TS(ctx, n);
    else if (n instanceof ast.ForInStatement)
        return exports.forInStatement2TS(ctx, n);
    else if (n instanceof ast.ForOfStatement)
        return exports.forOfStatement2TS(ctx, n);
    else if (n instanceof ast.Characters)
        return exports.characters2TS(n);
    else if (n instanceof ast.ContextProperty)
        return exports.contextProperty2TS(n);
    else if (n instanceof ast.QualifiedConstructor)
        return exports.qualifiedConstructor2TS(n);
    else if (n instanceof ast.UnqualifiedConstructor)
        return exports.unqualifiedConstructor2TS(n);
    else if (n instanceof ast.UnqualifiedIdentifier)
        return exports.unqualifiedIdentifier2TS(n);
    else if (n instanceof ast.QualifiedIdentifier)
        return exports.qualifiedIdentifier2TS(n);
    else
        return '';
};
exports.child2TS = child2TS;
/**
 * tag2TS converts a tag to typescript.
 */
var tag2TS = function (ctx, n) { return (n.type === 'widget') ?
    exports.widget2TS(ctx, n) : exports.node2TS(ctx, n); };
exports.tag2TS = tag2TS;
/**
 * widget2TS converts a Widget node into its typescript representation.
 *
 * This is simply a call to the View's widget method.
 */
var widget2TS = function (ctx, n) {
    var name = exports.constructor2TS(n.open);
    var attrs = exports.attrs2String(exports.groupAttrs(ctx, n.attributes));
    var childs = exports.children2TS(ctx, n.children);
    return exports.THIS + ".widget(new " + name + "(" + attrs + ", " + childs + ")," +
        ("<" + exports.WML + ".Attrs>" + attrs + ")");
};
exports.widget2TS = widget2TS;
/**
 * node2TS converts a Node into its typescript representation.
 *
 * This is simply a call to the View's node method.
 */
var node2TS = function (ctx, n) {
    var name = exports.identifier2TS(n.open);
    var attrs = exports.attrs2String(exports.groupAttrs(ctx, n.attributes));
    var childs = exports.children2TS(ctx, n.children);
    return exports.THIS + ".node('" + name + "', <" + exports.WML + ".Attrs>" + attrs + ", " + childs + ")";
};
exports.node2TS = node2TS;
/**
 * attribute2Value
 */
var attribute2TS = function (ctx, n) {
    return exports.attributeName2TS(ctx, n) + " : " + exports.attributeValue2TS(ctx, n) + " ";
};
exports.attribute2TS = attribute2TS;
/**
 * attributeValue2TS
 */
var attributeValue2TS = function (ctx, n) {
    return (n.value instanceof ast.Interpolation) ?
        exports.interpolation2TS(ctx, n.value) :
        exports.literal2TS(ctx, n.value);
};
exports.attributeValue2TS = attributeValue2TS;
/**
 * attributeName2TS
 */
var attributeName2TS = function (_, n) {
    return "'" + exports.unqualifiedIdentifier2TS(n.name) + "'";
};
exports.attributeName2TS = attributeName2TS;
/**
 * attrs2String
 */
var attrs2String = function (attrs) {
    return '{' +
        Object.keys(attrs).map(function (name) {
            return Array.isArray(attrs[name]) ?
                name + " : { " + attrs[name].join(',') + " }" :
                name + ": " + attrs[name];
        }) +
        '}';
};
exports.attrs2String = attrs2String;
/**
 * groupAttrs
 */
var groupAttrs = function (ctx, attrs) {
    var _a = array_1.partition(attrs, function (a) { return (a.namespace.value === ''); }), nns = _a[0], ns = _a[1];
    var nso = ns.reduce(function (p, n) {
        var _a;
        return record_1.merge(p, (_a = {},
            _a[n.namespace.value] = (p[n.namespace.value] || []).concat(exports.attribute2TS(ctx, n)),
            _a));
    }, {});
    return nns.reduce(function (p, n) {
        var _a;
        return record_1.merge(p, (_a = {},
            _a[exports.attributeName2TS(ctx, n)] = exports.attributeValue2TS(ctx, n),
            _a));
    }, nso);
};
exports.groupAttrs = groupAttrs;
/**
 * interpolation2TS
 */
var interpolation2TS = function (ctx, n) {
    return n.filters.reduce(function (p, c) {
        return exports.expression2TS(ctx, c) + " (" + p + ")";
    }, exports.expression2TS(ctx, n.expression));
};
exports.interpolation2TS = interpolation2TS;
/**
 * ifStatementTS converts an IfStatement to its typescript representation.
 */
var ifStatement2TS = function (ctx, n) {
    var condition = exports.expression2TS(ctx, n.condition);
    var conseq = exports.children2TS(ctx, n.then);
    var alt = (n.elseClause instanceof ast.ElseIfClause) ?
        "[" + exports.ifStatement2TS(ctx, n.elseClause) + "]" :
        (n.elseClause instanceof ast.ElseClause) ?
            exports.children2TS(ctx, n.elseClause.children) :
            '[]';
    return [
        "...((" + condition + ") ?",
        "(()=>(" + conseq + "))() :",
        "(()=>(" + alt + "))())"
    ].join(ctx.options.EOL);
};
exports.ifStatement2TS = ifStatement2TS;
/**
 * forInStatement2TS converts a ForInStatement to its typescript representation.
 */
var forInStatement2TS = function (ctx, n) {
    var expr = exports.expression2TS(ctx, n.expression);
    var value = exports.parameter2TS(n.variables[0]);
    var key = n.variables.length > 1 ? exports.parameter2TS(n.variables[1]) : '_$$i';
    var all = n.variables.length > 2 ? exports.parameter2TS(n.variables[2]) : '_$$all';
    var body = exports.children2TS(ctx, n.body);
    var alt = n.otherwise.length > 0 ? exports.children2TS(ctx, n.otherwise) : '[]';
    return [
        "..." + FOR_IN + " (" + expr + ", (" + value + ", " + key + ", " + all + ")=> ",
        "(" + body + "), ",
        "()=> (" + alt + "))"
    ].join(ctx.options.EOL);
};
exports.forInStatement2TS = forInStatement2TS;
/**
 * forOfStatement2TS
 */
var forOfStatement2TS = function (ctx, n) {
    var expr = exports.expression2TS(ctx, n.expression);
    var value = exports.parameter2TS(n.variables[0]);
    var key = n.variables.length > 1 ? exports.parameter2TS(n.variables[1]) : '_$$k';
    var all = n.variables.length > 2 ? exports.parameter2TS(n.variables[2]) : '_$$all';
    var body = exports.children2TS(ctx, n.body);
    var alt = n.otherwise.length > 0 ? exports.children2TS(ctx, n.otherwise) : '[]';
    return [
        "..." + FOR_OF + " (" + expr + ", (" + value + ", " + key + ", " + all + ") => ",
        "       (" + body + "), ",
        "    ()=> (" + alt + "))"
    ].join(eol(ctx));
};
exports.forOfStatement2TS = forOfStatement2TS;
/**
 * characters2TS converts character text to a typescript string.
 */
var characters2TS = function (n) {
    return exports.DOCUMENT + ".createTextNode('" + breakLines(n.value) + "')";
};
exports.characters2TS = characters2TS;
var breakLines = function (str) { return str.split('\n').join('\\u000a'); };
/**
 * expression2TS
 */
var expression2TS = function (ctx, n) {
    if (n instanceof ast.IfThenExpression)
        return exports.ifThenExpression2TS(ctx, n);
    else if (n instanceof ast.BinaryExpression)
        return exports.binaryExpression2TS(ctx, n);
    else if (n instanceof ast.UnaryExpression)
        return exports.unaryExpression2TS(ctx, n);
    else if (n instanceof ast.TypeAssertion)
        return exports.typeAssertion2TS(ctx, n);
    else if (n instanceof ast.ViewConstruction)
        return exports.viewConstruction2TS(ctx, n);
    else if (n instanceof ast.FunApplication)
        return exports.funApplication2TS(ctx, n);
    else if (n instanceof ast.ConstructExpression)
        return exports.constructExpression2TS(ctx, n);
    else if (n instanceof ast.CallExpression)
        return exports.callExpression2TS(ctx, n);
    else if (n instanceof ast.MemberExpression)
        return exports.memberExpression2TS(ctx, n);
    else if (n instanceof ast.FunctionExpression)
        return exports.functionExpression2TS(ctx, n);
    else if (n instanceof ast.Record)
        return exports.record2TS(ctx, n);
    else if (n instanceof ast.List)
        return exports.list2TS(ctx, n);
    else if (n instanceof ast.BooleanLiteral)
        return exports.boolean2TS(n);
    else if (n instanceof ast.NumberLiteral)
        return exports.number2TS(n);
    else if (n instanceof ast.StringLiteral)
        return exports.string2TS(n);
    else if (n instanceof ast.ContextProperty)
        return exports.contextProperty2TS(n);
    else if (n instanceof ast.QualifiedConstructor)
        return exports.qualifiedConstructor2TS(n);
    else if (n instanceof ast.UnqualifiedConstructor)
        return exports.unqualifiedConstructor2TS(n);
    else if (n instanceof ast.UnqualifiedIdentifier)
        return exports.unqualifiedIdentifier2TS(n);
    else if (n instanceof ast.QualifiedIdentifier)
        return exports.qualifiedIdentifier2TS(n);
    else if (n instanceof ast.ContextVariable)
        return exports.contextVariable2TS(n);
    else
        return '';
};
exports.expression2TS = expression2TS;
/**
 * ifThenExpression2TS
 */
var ifThenExpression2TS = function (ctx, n) {
    var condition = exports.expression2TS(ctx, n.condition);
    var conseq = exports.expression2TS(ctx, n.iftrue);
    var alt = exports.expression2TS(ctx, n.iffalse);
    return "(" + condition + ") ? " + conseq + " :  " + alt;
};
exports.ifThenExpression2TS = ifThenExpression2TS;
/**
 * binaryExpression2TS
 */
var binaryExpression2TS = function (ctx, n) {
    var left = exports.expression2TS(ctx, n.left);
    var right = exports.expression2TS(ctx, n.right);
    var op = operators.hasOwnProperty(n.operator) ?
        operators[n.operator] :
        n.operator;
    return "(" + left + " " + op + " " + right + ")";
};
exports.binaryExpression2TS = binaryExpression2TS;
/**
 * unaryExpression2TS
 */
var unaryExpression2TS = function (ctx, n) {
    var expr = exports.expression2TS(ctx, n.expression);
    return (n.operator === '??') ?
        "(" + expr + ") != null" :
        n.operator + "(" + expr + ")";
};
exports.unaryExpression2TS = unaryExpression2TS;
/**
 * typeAssertion2TS
 */
var typeAssertion2TS = function (ctx, n) {
    return "<" + exports.type2TS(n.target) + ">(" + exports.expression2TS(ctx, n.expression) + ")";
};
exports.typeAssertion2TS = typeAssertion2TS;
/**
 * viewConstruction2TS
 */
var viewConstruction2TS = function (ctx, n) {
    return exports.THIS + ".registerView((new " + exports.constructor2TS(n.cons) +
        ("(" + exports.expression2TS(ctx, n.context) + "))).render()");
};
exports.viewConstruction2TS = viewConstruction2TS;
/**
 * funApplication2TS
 */
var funApplication2TS = function (ctx, n) {
    return "" + exports.expression2TS(ctx, n.target) + exports.typeArgs2TS(n.typeArgs) + " " +
        ("(" + exports.args2TS(ctx, n.args) + ")(" + exports.THIS + ")");
};
exports.funApplication2TS = funApplication2TS;
/**
 * constructExpression2TS
 */
var constructExpression2TS = function (ctx, n) {
    var cons = exports.constructor2TS(n.cons);
    var consOriginal = "" + cons[0].toUpperCase() + cons.slice(1);
    var args = exports.args2TS(ctx, n.args);
    if (array_1.contains(casters, consOriginal)) {
        return consOriginal + "(" + args + ")";
    }
    else {
        return "new " + cons + "(" + args + ")";
    }
};
exports.constructExpression2TS = constructExpression2TS;
/**
 * callExpression2TS
 */
var callExpression2TS = function (ctx, n) {
    var target = exports.expression2TS(ctx, n.target);
    var typeArgs = exports.typeArgs2TS(n.typeArgs);
    var args = exports.args2TS(ctx, n.args);
    return "" + target + typeArgs + "(" + args + ")";
};
exports.callExpression2TS = callExpression2TS;
/**
 * typeArgs2TS
 */
var typeArgs2TS = function (ns) {
    return ns.length === 0 ? '' : "<" + ns.map(exports.type2TS).join(',') + ">";
};
exports.typeArgs2TS = typeArgs2TS;
/**
 * args2TS converts a list of arguments to a typescript argument tupple.
 */
var args2TS = function (ctx, ns) {
    return (ns.length === 0) ? '' : ns.map(function (e) { return exports.expression2TS(ctx, e); }).join(',');
};
exports.args2TS = args2TS;
/**
 * memberExpression2TS
 */
var memberExpression2TS = function (ctx, n) {
    return exports.expression2TS(ctx, n.target) + "." + exports.identifier2TS(n.member) + " ";
};
exports.memberExpression2TS = memberExpression2TS;
/**
 * functionExpression2TS
 */
var functionExpression2TS = function (ctx, n) {
    var params = n.parameters.map(exports.parameter2TS).join(',');
    var body = exports.expression2TS(ctx, n.body);
    return "(" + params + ") => " + body;
};
exports.functionExpression2TS = functionExpression2TS;
/**
 * literal2TS
 */
var literal2TS = function (ctx, n) {
    if (n instanceof ast.BooleanLiteral)
        return exports.boolean2TS(n);
    else if (n instanceof ast.StringLiteral)
        return exports.string2TS(n);
    else if (n instanceof ast.NumberLiteral)
        return exports.number2TS(n);
    else if (n instanceof ast.Record)
        return exports.record2TS(ctx, n);
    else if (n instanceof ast.List)
        return exports.list2TS(ctx, n);
    else
        return '';
};
exports.literal2TS = literal2TS;
/**
 * boolean2TS
 */
var boolean2TS = function (n) { return n.value + " "; };
exports.boolean2TS = boolean2TS;
/**
 * string2TS
 */
var string2TS = function (n) { return "'" + n.value + "'"; };
exports.string2TS = string2TS;
/**
 * number2TS
 */
var number2TS = function (n) { return "" + parseFloat(n.value); };
exports.number2TS = number2TS;
/**
 * record2TS
 */
var record2TS = function (ctx, n) {
    return "{" + ctx.options.EOL + " \n      " + n.properties.map(function (p) { return exports.property2TS(ctx, p); }).join(',' + ctx.options.EOL) + "\n     }";
};
exports.record2TS = record2TS;
/**
 * list2TS
 */
var list2TS = function (ctx, n) {
    var mems = n.members.map(function (e) { return exports.expression2TS(ctx, e); });
    return "[" + ctx.options.EOL + "\n            " + mems.join(',' + ctx.options.EOL) + "\n            ]";
};
exports.list2TS = list2TS;
/**
 * property2TS
 */
var property2TS = function (ctx, n) {
    return "'" + exports.key2TS(n.key) + "' : " + exports.expression2TS(ctx, n.value);
};
exports.property2TS = property2TS;
/**
 * key2TS
 */
var key2TS = function (n) {
    return (n instanceof ast.StringLiteral) ? exports.string2TS(n) : exports.identifier2TS(n);
};
exports.key2TS = key2TS;
/**
 * contextProperty2TS
 */
var contextProperty2TS = function (n) {
    return exports.CONTEXT + "." + exports.identifier2TS(n.member);
};
exports.contextProperty2TS = contextProperty2TS;
/**
 * contextVariable2TS
 */
var contextVariable2TS = function (_) { return "" + exports.CONTEXT; };
exports.contextVariable2TS = contextVariable2TS;
/**
 * identifierOrConstructor2TS
 */
var identifierOrConstructor2TS = function (n) {
    if ((n instanceof ast.UnqualifiedIdentifier) ||
        (n instanceof ast.QualifiedIdentifier))
        return exports.identifier2TS(n);
    else if ((n instanceof ast.UnqualifiedConstructor) ||
        (n instanceof ast.QualifiedConstructor))
        return exports.constructor2TS(n);
    else
        return '';
};
exports.identifierOrConstructor2TS = identifierOrConstructor2TS;
/**
 * constructor2TS
 */
var constructor2TS = function (n) {
    if (n instanceof ast.QualifiedConstructor)
        return exports.qualifiedConstructor2TS(n);
    else if (n instanceof ast.UnqualifiedConstructor)
        return exports.unqualifiedConstructor2TS(n);
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
    return n.qualifier + "." + n.member;
};
exports.qualifiedConstructor2TS = qualifiedConstructor2TS;
/**
 * identifier2TS
 */
var identifier2TS = function (n) {
    if (n instanceof ast.QualifiedIdentifier)
        return exports.qualifiedIdentifier2TS(n);
    else if (n instanceof ast.UnqualifiedIdentifier)
        return exports.unqualifiedIdentifier2TS(n);
    else
        return '';
};
exports.identifier2TS = identifier2TS;
/**
 * qualifiedIdentifier2TS
 */
var qualifiedIdentifier2TS = function (n) {
    return n.qualifier + "." + n.member;
};
exports.qualifiedIdentifier2TS = qualifiedIdentifier2TS;
/**
 * unqualifiedIdentifier2TS
 */
var unqualifiedIdentifier2TS = function (n) {
    return "" + toPrim(n.value);
};
exports.unqualifiedIdentifier2TS = unqualifiedIdentifier2TS;
var toPrim = function (id) { return prims.indexOf(id) > -1 ? id.toLowerCase() : id; };
//# sourceMappingURL=codegen.js.map