"use strict";
/**
 * Typescript code generator.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.forFromStatement2TS = exports.forOfStatement2TS = exports.forInStatement2TS = exports.ifStatement2TS = exports.interpolation2TS = exports.attrs2String = exports.attributeName2TS = exports.attributeValue2TS = exports.attribute2TS = exports.node2TS = exports.widget2TS = exports.tag2TS = exports.child2TS = exports.children2TS = exports.untypedParameter2TS = exports.typedParameter2TS = exports.parameter2TS = exports.parameters2TS = exports.typeMap2TS = exports.expandTypeMap = exports.typeMapFromRecordType = exports.typeMapFromMemberDecs = exports.memberDeclarations2TS = exports.recordType2Ts = exports.tupleType2TS = exports.listType2TS = exports.functionType2TS = exports.constructorType2TS = exports.type2TS = exports.typeParameter2TS = exports.typeParameters2TS = exports.viewStatement2TS = exports.funStatement2TS = exports.letStatement2TS = exports.contextStatement2TS = exports.aliasStatement2TS = exports.export2TS = exports.exports2TS = exports.compositeMember2TS = exports.aliasedMember2TS = exports.aggregateMember2TS = exports.importMember2TS = exports.importStatement2TS = exports.importStatements2TS = exports.CodeGenerator = exports.THIS = exports.DOCUMENT = exports.WML = exports.VIEW = exports.CONTEXT = void 0;
exports.unqualifiedIdentifier2TS = exports.qualifiedIdentifier2TS = exports.identifier2TS = exports.qualifiedConstructor2TS = exports.unqualifiedConstructor2TS = exports.constructor2TS = exports.identifierOrConstructor2TS = exports.contextVariable2TS = exports.contextProperty2TS = exports.key2TS = exports.property2TS = exports.list2TS = exports.record2TS = exports.number2TS = exports.string2TS = exports.boolean2TS = exports.literal2TS = exports.functionExpression2TS = exports.memberExpression2TS = exports.args2TS = exports.typeArgs2TS = exports.callExpression2TS = exports.constructExpression2TS = exports.funApplication2TS = exports.viewConstruction2TS = exports.typeAssertion2TS = exports.unaryExpression2TS = exports.binaryExpression2TS = exports.ifThenExpression2TS = exports.expression2TS = exports.characters2TS = void 0;
/** imports */
const ast = require("../parse/ast");
const path_1 = require("@quenk/noni/lib/data/record/path");
const record_1 = require("@quenk/noni/lib/data/record");
const array_1 = require("@quenk/noni/lib/data/array");
const transform_1 = require("./transform");
exports.CONTEXT = '__context';
exports.VIEW = '__view';
exports.WML = '__wml';
exports.DOCUMENT = '__document';
exports.THIS = '__this';
const MAYBE = '__Maybe';
const FROM_NULLABLE = '__fromNullable';
const FROM_ARRAY = '__fromArray';
const NODE_PARAMS = `tag:string, attrs:${exports.WML}.Attrs, ` +
    `children: ${exports.WML}.Content[]`;
const WIDGET_PARAMS = `w: ${exports.WML}.Widget, attrs:${exports.WML}.Attrs`;
const REGISTER_VIEW_PARAMS = `v:${exports.WML}.View`;
const REGISTER_PARAMS = `e:${exports.WML}.WMLElement, ` +
    `attrs:${exports.WML}.Attributes<any>`;
const THROW_CHILD_ERR = '         throw new TypeError(`Can not adopt ' +
    'child ${c} of type \${typeof c}`);';
const THROW_INVALIDATE_ERR = `       throw new Error('invalidate(): cannot ` +
    `invalidate this view, it has no parent node!');`;
const IGNORE_UNUSED = '//@ts-ignore:6192';
const RECORD = '__Record<A>';
const IF = '__if';
const IFARG = `__IfArg`;
const FOR_OF = '__forOf';
const FOR_IN = '__forIn';
const FOR_ALT_TYPE = '__ForAlt';
const FOR_IN_BODY = '__ForInBody<A>';
const FOR_OF_BODY = '__ForOfBody<A>';
const prims = [
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
const casters = ['String', 'Boolean', 'Number', 'Object'];
const operators = {
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
class CodeGenerator {
    constructor(options) {
        this.options = options;
    }
    /**
     * create a new CodeGenerator instance.
     */
    static create(opts) {
        return new CodeGenerator(opts);
    }
    /**
     * generate a Typescript module from an WML AST.
     */
    generate(tree) {
        let newTree = (0, transform_1.transformTree)(tree);
        return [
            `import * as ${exports.WML} from '${this.options.module}';`,
            `import * as ${exports.DOCUMENT} from '${this.options.dom}';`,
            imports(this),
            (0, exports.importStatements2TS)(this, newTree.imports),
            eol(this),
            typeDefinitions(this),
            eol(this),
            `// @ts-ignore 6192`,
            `const text = ${exports.DOCUMENT}.text;`,
            `// @ts-ignore 6192`,
            `const unsafe = ${exports.DOCUMENT}.unsafe`,
            `// @ts-ignore 6192`,
            `const isSet = (value:any) => value != null`,
            (0, exports.exports2TS)(this, newTree.exports)
        ].join(eol(this));
    }
}
exports.CodeGenerator = CodeGenerator;
const eol = (ctx) => `${ctx.options.EOL}`;
const imports = (ctx) => [
    `//@ts-ignore: 6192`,
    `import {`,
    `Maybe as ${MAYBE},`,
    `fromNullable as ${FROM_NULLABLE},`,
    `fromArray as ${FROM_ARRAY}`,
    `}`,
    `from '@quenk/noni/lib/data/maybe';`
].join(eol(ctx));
const typeDefinitions = (ctx) => [
    `${IGNORE_UNUSED}`,
    `type ${IFARG} = ()=>${exports.WML}.Content[]`,
    ``,
    `${IGNORE_UNUSED}`,
    `type ${FOR_ALT_TYPE} = ()=> ${exports.WML}.Content[]`,
    ``,
    `${IGNORE_UNUSED}`,
    `type ${FOR_IN_BODY} =(val:A, idx:number, all:A[])=>` +
        `${exports.WML}.Content[]`,
    ``,
    `${IGNORE_UNUSED}`,
    `type ${FOR_OF_BODY} = (val:A, key:string, all:object) =>` +
        `${exports.WML}.Content[]`,
    ``,
    `${IGNORE_UNUSED}`,
    `interface ${RECORD} {`,
    ``,
    ` [key:string]: A`,
    ``,
    `}`,
    ``,
    `${IGNORE_UNUSED}`,
    `const ${IF} = (__expr:boolean, __conseq:${IFARG},__alt?:${IFARG}) ` +
        `: Content[]=>`,
    `(__expr) ? __conseq() :  __alt ? __alt() : [];`,
    ``,
    `${IGNORE_UNUSED}`,
    `const ${FOR_IN} = <A>(list:A[], f:${FOR_IN_BODY}, alt:` +
        `${FOR_ALT_TYPE}) : ${exports.WML}.Content[] => {`,
    ``,
    `   let ret:${exports.WML}.Content[] = [];`,
    ``,
    `   for(let i=0; i<list.length; i++)`,
    `       ret = ret.concat(f(list[i], i, list));`,
    ``,
    `   return ret.length === 0 ? alt() : ret;`,
    ``,
    `}`,
    `${IGNORE_UNUSED}`,
    `const ${FOR_OF} = <A>(o:${RECORD}, f:${FOR_OF_BODY},` +
        `alt:${FOR_ALT_TYPE}) : ${exports.WML}.Content[] => {`,
    ``,
    `    let ret:${exports.WML}.Content[] = [];`,
    ``,
    `    for(let key in o)`,
    `  	    if(o.hasOwnProperty(key)) `,
    `	        ret = ret.concat(f((o)[key], key, o));`,
    ``,
    `    return ret.length === 0 ? alt(): ret;`,
    ``,
    `}`
].join(eol(ctx));
/**
 * importStatements2TS converts a list of ImportStatements into typescript.
 */
const importStatements2TS = (ctx, list) => list
    .map(exports.importStatement2TS)
    .filter((stmt, idx, list) => list.indexOf(stmt) == idx)
    .join(`;${eol(ctx)}`);
exports.importStatements2TS = importStatements2TS;
/**
 * importStatement2TS
 */
const importStatement2TS = (n) => `import ${(0, exports.importMember2TS)(n.member)} from '${n.module.value.trim()}'; `;
exports.importStatement2TS = importStatement2TS;
/**
 * importMember2TS
 */
const importMember2TS = (n) => {
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
const aggregateMember2TS = (n) => `* as ${(0, exports.identifierOrConstructor2TS)(n.id)} `;
exports.aggregateMember2TS = aggregateMember2TS;
/**
 * aliasedMember2TS
 */
const aliasedMember2TS = (n) => `${(0, exports.identifierOrConstructor2TS)(n.member)} ` +
    `as ${(0, exports.identifierOrConstructor2TS)(n.alias)} `;
exports.aliasedMember2TS = aliasedMember2TS;
/**
 * compositeMember2TS
 */
const compositeMember2TS = (n) => '{' + (n.members.map(m => (m instanceof ast.AliasedMember) ?
    (0, exports.aliasedMember2TS)(m) :
    (0, exports.identifierOrConstructor2TS)(m)).join(',')) + '}';
exports.compositeMember2TS = compositeMember2TS;
/**
 * exports2TS converts a list of exports to typescript.
 */
const exports2TS = (ctx, list) => list.map(e => (0, exports.export2TS)(ctx, e)).join(';' + eol(ctx));
exports.exports2TS = exports2TS;
/**
 * export2TS
 */
const export2TS = (ctx, n) => {
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
const aliasStatement2TS = (n) => {
    let typeArgs = (n.typeParameters.length > 0) ?
        (0, exports.typeParameters2TS)(n.typeParameters) : '';
    let preamble = `export type ${n.id.value}${typeArgs}`;
    let members = n.members.map(m => (0, exports.type2TS)(m)).join('|');
    return `${preamble} = ${members};`;
};
exports.aliasStatement2TS = aliasStatement2TS;
/**
 * contextStatement2TS
 */
const contextStatement2TS = (n) => {
    let preamble = `export interface ${n.id.value}`;
    let typeArgs = (n.typeParameters.length > 0) ?
        (0, exports.typeParameters2TS)(n.typeParameters) : '';
    let [parents, members] = (0, array_1.partition)(n.members, member => member instanceof ast.ConstructorType);
    let parentList = parents
        .map(exports.constructorType2TS).join(',');
    parentList = (parentList !== '') ? ` extends ${parentList}` : '';
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
const letStatement2TS = (ctx, n) => _setStatement2TS(ctx, n, 'export const');
exports.letStatement2TS = letStatement2TS;
const _setStatement2TS = (ctx, n, preamble) => {
    let id = (0, exports.identifier2TS)(n.id);
    let cons = (0, exports.constructorType2TS)(n.cons);
    preamble = `${preamble} ${id}:${cons}`;
    let value = (0, exports.expression2TS)(ctx, n.expression);
    return `${preamble} = ${value}`;
};
/**
 * funStatement2TS generates Typescript output for fun statements.
 *
 * This is a curried function that first accepts zero or more arguments then
 * a single Registry, finally the content.
 */
const funStatement2TS = (ctx, n) => {
    let id = (0, exports.unqualifiedIdentifier2TS)(n.id);
    let typeParams = (0, exports.typeParameters2TS)(n.typeParameters);
    let params = (0, exports.parameters2TS)(n.parameters);
    let factory = `(${exports.THIS}:${exports.WML}.Registry) : ${exports.WML}.Content[] =>`;
    let body = (0, exports.children2TS)(ctx, n.body);
    return [
        `export const ${id} = `,
        ``,
        `${typeParams}(${params})=>${factory} {`,
        ``,
        `   return ${body};`,
        ``,
        `};`
    ].join(eol(ctx));
};
exports.funStatement2TS = funStatement2TS;
/**
 * viewStatement2TS converts a ViewStatement to its typescript form.
 *
 * This is a class with template and various useful helpers.
 */
const viewStatement2TS = (ctx, n) => {
    let instances = n.directives.map(i => _setStatement2TS(ctx, i, 'let')).join(`;${ctx.options.EOL}`);
    let id = n.id ? (0, exports.constructor2TS)(n.id) : 'Main';
    let typeParams = (0, exports.typeParameters2TS)(n.typeParameters);
    let context = (0, exports.type2TS)((n.context instanceof ast.ContextFromStatement) ?
        n.context.cons : n.context);
    let template = (0, exports.tag2TS)(ctx, n.root);
    return [
        `export class ${id} ${typeParams} implements ${exports.WML}.View {`,
        ``,
        `   constructor(${exports.CONTEXT}: ${context}) {`,
        ``,
        `       this.template = (${exports.THIS}:${exports.WML}.Registry) => {`,
        ``,
        `       ${instances}`,
        ``,
        `           return ${template};`,
        ``,
        `       }`,
        ``,
        `   }`,
        ``,
        `   ids: { [key: string]: ${exports.WML}.WMLElement } = {};`,
        ``,
        `   groups: { [key: string]: ${exports.WML}.WMLElement[] } = {};`,
        ``,
        `   views: ${exports.WML}.View[] = [];`,
        ``,
        `   widgets: ${exports.WML}.Widget[] = [];`,
        ``,
        `   tree: Node = <Node>${exports.DOCUMENT}.createElement('div');`,
        ``,
        `   template: ${exports.WML}.Template;`,
        ``,
        `   registerView(${REGISTER_VIEW_PARAMS}) : ${exports.WML}.View {`,
        ``,
        `       this.views.push(v);`,
        ``,
        `       return v;`,
        ``,
        `}`,
        `   register(${REGISTER_PARAMS}) : ${exports.WML}.WMLElement {`,
        ``,
        `       let attrsMap = (<${exports.WML}.Attrs><any>attrs)`,
        ``,
        `       if(attrsMap.wml) {`,
        ``,
        `         let {id, group} = attrsMap.wml;`,
        ``,
        `         if(id != null) {`,
        ``,
        `             if (this.ids.hasOwnProperty(id))`,
        `               throw new Error(\`Duplicate id '\${id}' detected!\`);`,
        ``,
        `             this.ids[id] = e;`,
        ``,
        `         }`,
        ``,
        `         if(group != null) {`,
        ``,
        `             this.groups[group] = this.groups[group] || [];`,
        `             this.groups[group].push(e);`,
        ``,
        `         }`,
        ``,
        `         }`,
        `       return e;`,
        `}`,
        ``,
        `   node(${NODE_PARAMS}): ${exports.WML}.Content {`,
        ``,
        `       let e = ${exports.DOCUMENT}.createElement(tag);`,
        ``,
        `       Object.keys(attrs).forEach(key => {`,
        ``,
        `           let value = (<any>attrs)[key];`,
        ``,
        `           if (typeof value === 'function') {`,
        ``,
        `           (<any>e)[key] = value;`,
        ``,
        `           } else if (typeof value === 'string') {`,
        ``,
        `               //prevent setting things like disabled=''`,
        `               if (value !== '')`,
        `               e.setAttribute(key, value);`,
        ``,
        `           } else if (typeof value === 'boolean') {`,
        ``,
        `             e.setAttribute(key, '');`,
        ``,
        `           } else if(!${exports.DOCUMENT}.isBrowser && `,
        `                     value instanceof ${exports.DOCUMENT}.WMLDOMText) {`,
        ``,
        `             e.setAttribute(key, <any>value);`,
        ``,
        `           }`,
        ``,
        `       });`,
        ``,
        `       children.forEach(c => {`,
        ``,
        `               switch (typeof c) {`,
        ``,
        `                   case 'string':`,
        `                   case 'number':`,
        `                   case 'boolean':`,
        `                     let tn = ${exports.DOCUMENT}.createTextNode(''+c);`,
        `                     e.appendChild(<Node>tn)`,
        `                   case 'object':`,
        `                       e.appendChild(<Node>c);`,
        `                   break;`,
        `                   default:`,
        `                       ${THROW_CHILD_ERR}`,
        ``,
        `               }})`,
        ``,
        `       this.register(e, attrs);`,
        ``,
        `       return e;`,
        ``,
        `   }`,
        ``,
        ``,
        `   widget(${WIDGET_PARAMS}) : ${exports.WML}.Content {`,
        ``,
        `       this.register(w, attrs);`,
        ``,
        `       this.widgets.push(w);`,
        ``,
        `       return w.render();`,
        ``,
        `   }`,
        ``,
        `   findById<E extends ${exports.WML}.WMLElement>(id: string): ${MAYBE}<E> {`,
        ``,
        `       let mW:${MAYBE}<E> = ${FROM_NULLABLE}<E>(<E>this.ids[id])`,
        ``,
        `       return this.views.reduce((p,c)=>`,
        `       p.isJust() ? p : c.findById(id), mW);`,
        ``,
        `   }`,
        ``,
        `   findByGroup<E extends ${exports.WML}.WMLElement>(name: string): ` +
            `${MAYBE}<E[]> {`,
        ``,
        `      let mGroup:${MAYBE}<E[]> =`,
        `           ${FROM_ARRAY}(this.groups.hasOwnProperty(name) ?`,
        `           <any>this.groups[name] : `,
        `           []);`,
        ``,
        `      return this.views.reduce((p,c) =>`,
        `       p.isJust() ? p : c.findByGroup(name), mGroup);`,
        ``,
        `   }`,
        ``,
        `   invalidate() : void {`,
        ``,
        `       let {tree} = this;`,
        `       let parent = <Node>tree.parentNode;`,
        ``,
        `       if (tree == null)`,
        `           return console.warn('invalidate(): '+` +
            `       'Missing DOM tree!');`,
        ``,
        `       if (tree.parentNode == null)`,
        `           ${THROW_INVALIDATE_ERR}`,
        ``,
        `       parent.replaceChild(<Node>this.render(), tree) `,
        ``,
        `   }`,
        ``,
        `   render(): ${exports.WML}.Content {`,
        ``,
        `       this.ids = {};`,
        `       this.widgets.forEach(w => w.removed());`,
        `       this.widgets = [];`,
        `       this.views = [];`,
        `       this.tree = <Node>this.template(this);`,
        ``,
        `       this.ids['root'] = (this.ids['root']) ?`,
        `       this.ids['root'] : `,
        `       this.tree;`,
        ``,
        `       this.widgets.forEach(w => w.rendered());`,
        ``,
        `       return this.tree;`,
        ``,
        `   }`,
        ``,
        `}`
    ].join(eol(ctx));
};
exports.viewStatement2TS = viewStatement2TS;
/**
 * typeParameters2TS converts a list of typeParameters2TS into the a list of
 * typescript typeParameters2TS.
 */
const typeParameters2TS = (ns) => (ns.length === 0) ? '' : `<${ns.map(exports.typeParameter2TS).join(',')}> `;
exports.typeParameters2TS = typeParameters2TS;
/**
 * typeParameter2TS converts a type parameter into a typescript type parameter.
 */
const typeParameter2TS = (n) => `${toPrim((0, exports.identifierOrConstructor2TS)(n.id))} ` +
    `${n.constraint ? 'extends ' + (0, exports.type2TS)(n.constraint) : ''} `;
exports.typeParameter2TS = typeParameter2TS;
/**
 * type2TS
 */
const type2TS = (n) => {
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
const constructorType2TS = (n) => {
    let id = toPrim((0, exports.identifierOrConstructor2TS)(n.id));
    return (n.typeParameters.length > 0) ?
        id + (0, exports.typeParameters2TS)(n.typeParameters) : id;
};
exports.constructorType2TS = constructorType2TS;
/**
 * functionType2TS
 */
const functionType2TS = (n) => {
    let params = n.parameters.map((t, k) => `$${k}:${(0, exports.type2TS)(t)}`).join(',');
    let ret = (0, exports.type2TS)(n.returnType);
    return `(${params}) => ${ret}`;
};
exports.functionType2TS = functionType2TS;
/**
 * listType2TS
 */
const listType2TS = (n) => `(${(0, exports.type2TS)(n.elementType)})[]`;
exports.listType2TS = listType2TS;
/**
 * tupleType2TS
 */
const tupleType2TS = (n) => `[${n.members.map(exports.type2TS).join(',')}]`;
exports.tupleType2TS = tupleType2TS;
/**
 * recordType2TS converts the RecordType node to the body of a TypeScript
 * record interface.
 */
const recordType2Ts = (n) => '{' + (0, exports.memberDeclarations2TS)(n.members) + '}';
exports.recordType2Ts = recordType2Ts;
/**
 * memberDeclarations2TS converts a list of MemberDeclarations to TypeScript.
 *
 * The paths of the MemberDeclarations are expanded so that paths
 * using the "<path1>.<path2>.<path3>" syntax occur as nested records.
 */
const memberDeclarations2TS = (n) => (0, exports.typeMap2TS)((0, exports.expandTypeMap)((0, exports.typeMapFromMemberDecs)(n)));
exports.memberDeclarations2TS = memberDeclarations2TS;
/**
 * typeMapFromMemberDecs creates a TypeMap from a list of memberDeclarations.
 *
 * This works recursively and any RecordTypes encountered will be flattened.
 */
const typeMapFromMemberDecs = (list) => list.reduce((p, m) => {
    let paths = m.path.map(p => p.value);
    if (m.kind instanceof ast.RecordType) {
        return (0, exports.typeMapFromRecordType)(m.kind, p, paths);
    }
    else {
        let path = paths2String(paths);
        path = m.optional ? `${path}?` : path;
        p[path] = m.kind;
        return p;
    }
}, {});
exports.typeMapFromMemberDecs = typeMapFromMemberDecs;
/**
 * typeMapFromRecordType produces a map of node.Type instances from
 * a RecordType recursively.
 *
 * Any encountered RecordTypes will be flattened.
 */
const typeMapFromRecordType = (n, init, prefix) => n.members.reduce((p, m) => {
    let path = [...prefix, ...(m.path.map(p => p.value))];
    if (m.kind instanceof ast.RecordType) {
        return (0, exports.typeMapFromRecordType)(m.kind, init, path);
    }
    else {
        p[paths2String(path)] = m.kind;
        return p;
    }
}, init);
exports.typeMapFromRecordType = typeMapFromRecordType;
const paths2String = (paths) => paths.join('.');
/**
 * expandTypeMap to an ExpandedTypeMap.
 */
const expandTypeMap = (m) => (0, record_1.reduce)(m, {}, (p, c, k) => (0, path_1.set)(k, (0, exports.type2TS)(c), p));
exports.expandTypeMap = expandTypeMap;
/**
 * typeMap2TS converts a map of type values to TypeScript.
 */
const typeMap2TS = (m) => (0, record_1.mapTo)(m, (t, k) => {
    if ((0, record_1.isRecord)(t)) {
        let key = isOptional(t) ? `${k}?` : `${k}`;
        return `${key}: {${(0, exports.typeMap2TS)(t)}}`;
    }
    else {
        return `${k} : ${t}`;
    }
}).join(',\n');
exports.typeMap2TS = typeMap2TS;
const isOptional = (m) => (0, record_1.reduce)(m, false, (p, _, k) => p ? p : k.indexOf('?') > -1);
/**
 * parameters2TS converts a list Parameter nodes into an parameter list
 * (without parens).
 */
const parameters2TS = (list) => list.map(p => (0, exports.parameter2TS)(p)).join(',');
exports.parameters2TS = parameters2TS;
/**
 * parameter2TS
 */
const parameter2TS = (n) => {
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
const typedParameter2TS = (n) => `${(0, exports.identifier2TS)(n.id)}: ${(0, exports.type2TS)(n.hint)} `;
exports.typedParameter2TS = typedParameter2TS;
/**
 * untypedParameter2TS
 */
const untypedParameter2TS = (n) => `${(0, exports.identifier2TS)(n.id)} `;
exports.untypedParameter2TS = untypedParameter2TS;
/**
 * children2TS
 */
const children2TS = (ctx, list) => `[${ctx.options.EOL}
        ${list.map(l => (0, exports.child2TS)(ctx, l)).join(',' + ctx.options.EOL)}
     ]`;
exports.children2TS = children2TS;
/**
 * child2TS converts children to typescript.
 */
const child2TS = (ctx, n) => {
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
    else if (n instanceof ast.ForFromStatement)
        return (0, exports.forFromStatement2TS)(ctx, n);
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
const tag2TS = (ctx, n) => (n instanceof ast.Widget) ? (0, exports.widget2TS)(ctx, n) : (0, exports.node2TS)(ctx, n);
exports.tag2TS = tag2TS;
/**
 * widget2TS converts a Widget node into its typescript representation.
 *
 * This is simply a call to the View's widget method.
 */
const widget2TS = (ctx, n) => {
    let name = (0, exports.constructor2TS)(n.open);
    let typeParams = (0, exports.typeArgs2TS)(n.typeArgs);
    let attrs = (0, exports.attrs2String)(ctx, n.attributes);
    let childs = (0, exports.children2TS)(ctx, n.children);
    return `${exports.THIS}.widget(new ${name}${typeParams}(${attrs}, ${childs}),` +
        `<${exports.WML}.Attrs>${attrs})`;
};
exports.widget2TS = widget2TS;
/**
 * node2TS converts a Node into its typescript representation.
 *
 * This is simply a call to the View's node method.
 */
const node2TS = (ctx, n) => {
    let name = (0, exports.identifier2TS)(n.open);
    let attrs = (0, exports.attrs2String)(ctx, n.attributes);
    let childs = (0, exports.children2TS)(ctx, n.children);
    return `${exports.THIS}.node('${name}', <${exports.WML}.Attrs>${attrs}, ${childs})`;
};
exports.node2TS = node2TS;
/**
 * attribute2Value
 */
const attribute2TS = (ctx, n) => `${(0, exports.attributeName2TS)(ctx, n)} : ${(0, exports.attributeValue2TS)(ctx, n)} `;
exports.attribute2TS = attribute2TS;
/**
 * attributeValue2TS
 */
const attributeValue2TS = (ctx, n) => (n.value instanceof ast.Interpolation) ?
    (0, exports.interpolation2TS)(ctx, n.value) :
    (0, exports.literal2TS)(ctx, n.value);
exports.attributeValue2TS = attributeValue2TS;
/**
 * attributeName2TS
 */
const attributeName2TS = (_, n) => `'${(0, exports.unqualifiedIdentifier2TS)(n.name)}'`;
exports.attributeName2TS = attributeName2TS;
/**
 * attrs2String
 */
const attrs2String = (ctx, attrs) => {
    // Check for the special wml:attrs attribute.
    let mallAttrs = (0, array_1.find)(attrs, attr => ((attr.namespace.value === 'wml') &&
        (attr.name.value === 'attrs')));
    if (mallAttrs.isJust())
        return (0, exports.attributeValue2TS)(ctx, mallAttrs.get());
    let [nns, ns] = (0, array_1.partition)(attrs, a => (a.namespace.value === ''));
    let nso = ns.reduce((p, n) => (0, record_1.merge)(p, {
        [n.namespace.value]: (p[n.namespace.value] || []).concat((0, exports.attribute2TS)(ctx, n))
    }), {});
    return _attrs2String(nns.reduce((p, n) => (0, record_1.merge)(p, {
        [(0, exports.attributeName2TS)(ctx, n)]: (0, exports.attributeValue2TS)(ctx, n)
    }), nso));
};
exports.attrs2String = attrs2String;
const _attrs2String = (attrs) => '{' +
    Object.keys(attrs).map(name => Array.isArray(attrs[name]) ?
        `${name} : { ${attrs[name].join(',')} }` :
        `${name}: ${attrs[name]}`) +
    '}';
/**
 * interpolation2TS
 */
const interpolation2TS = (ctx, n) => n.filters.reduce((p, c) => `${(0, exports.expression2TS)(ctx, c)} (${p})`, (0, exports.expression2TS)(ctx, n.expression));
exports.interpolation2TS = interpolation2TS;
/**
 * ifStatementTS converts an IfStatement to its typescript representation.
 */
const ifStatement2TS = (ctx, n) => {
    let condition = (0, exports.expression2TS)(ctx, n.condition);
    let conseq = (0, exports.children2TS)(ctx, n.then);
    let alt = (n.elseClause instanceof ast.ElseIfClause) ?
        `[${(0, exports.ifStatement2TS)(ctx, n.elseClause)}]` :
        (n.elseClause instanceof ast.ElseClause) ?
            (0, exports.children2TS)(ctx, n.elseClause.children) :
            '[]';
    return [
        `...((${condition}) ?`,
        `(()=>(${conseq}))() :`,
        `(()=>(${alt}))())`
    ].join(ctx.options.EOL);
};
exports.ifStatement2TS = ifStatement2TS;
/**
 * forInStatement2TS converts a ForInStatement to its typescript representation.
 */
const forInStatement2TS = (ctx, n) => {
    let expr = (0, exports.expression2TS)(ctx, n.expression);
    let value = (0, exports.parameter2TS)(n.variables[0]);
    let key = n.variables.length > 1 ? (0, exports.parameter2TS)(n.variables[1]) : '_$$i';
    let all = n.variables.length > 2 ? (0, exports.parameter2TS)(n.variables[2]) : '_$$all';
    let body = (0, exports.children2TS)(ctx, n.body);
    let alt = n.otherwise.length > 0 ? (0, exports.children2TS)(ctx, n.otherwise) : '[]';
    return [
        `...${FOR_IN} (${expr}, (${value}, ${key}, ${all})=> `,
        `(${body}), `,
        `()=> (${alt}))`
    ].join(ctx.options.EOL);
};
exports.forInStatement2TS = forInStatement2TS;
/**
 * forOfStatement2TS
 */
const forOfStatement2TS = (ctx, n) => {
    let expr = (0, exports.expression2TS)(ctx, n.expression);
    let value = (0, exports.parameter2TS)(n.variables[0]);
    let key = n.variables.length > 1 ? (0, exports.parameter2TS)(n.variables[1]) : '_$$k';
    let all = n.variables.length > 2 ? (0, exports.parameter2TS)(n.variables[2]) : '_$$all';
    let body = (0, exports.children2TS)(ctx, n.body);
    let alt = n.otherwise.length > 0 ? (0, exports.children2TS)(ctx, n.otherwise) : '[]';
    return [
        `...${FOR_OF} (${expr}, (${value}, ${key}, ${all}) => `,
        `       (${body}), `,
        `    ()=> (${alt}))`
    ].join(eol(ctx));
};
exports.forOfStatement2TS = forOfStatement2TS;
/**
 * forFromStatement2TS
 */
const forFromStatement2TS = (ctx, node) => {
    let value = (0, exports.parameter2TS)(node.variable);
    let start = (0, exports.expression2TS)(ctx, node.start);
    let end = (0, exports.expression2TS)(ctx, node.end);
    let body = (0, exports.children2TS)(ctx, node.body);
    return [
        `...(function forFrom()  {`,
        `  let result:${exports.WML}.Content[] = [];`,
        `  for(let ${value}:number=${start}; ${value}<=${end}; ${value}++)`,
        `   result.push(`,
        `     ...${body}`,
        `   );`,
        `  return result;`,
        `})()`
    ].join(eol(ctx));
};
exports.forFromStatement2TS = forFromStatement2TS;
/**
 * characters2TS converts character text to a typescript string.
 */
const characters2TS = (n) => `${exports.DOCUMENT}.createTextNode('${breakLines(n.value)}')`;
exports.characters2TS = characters2TS;
const breakLines = (str) => str.split('\n').join('\\u000a');
/**
 * expression2TS
 */
const expression2TS = (ctx, n) => {
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
const ifThenExpression2TS = (ctx, n) => {
    let condition = (0, exports.expression2TS)(ctx, n.condition);
    let conseq = (0, exports.expression2TS)(ctx, n.iftrue);
    let alt = (0, exports.expression2TS)(ctx, n.iffalse);
    return `(${condition}) ? ${conseq} :  ${alt}`;
};
exports.ifThenExpression2TS = ifThenExpression2TS;
/**
 * binaryExpression2TS
 */
const binaryExpression2TS = (ctx, n) => {
    let left = (0, exports.expression2TS)(ctx, n.left);
    let right = (0, exports.expression2TS)(ctx, n.right);
    let op = operators.hasOwnProperty(n.operator) ?
        operators[n.operator] :
        n.operator;
    return `(${left} ${op} ${right})`;
};
exports.binaryExpression2TS = binaryExpression2TS;
/**
 * unaryExpression2TS
 */
const unaryExpression2TS = (ctx, n) => {
    let expr = (0, exports.expression2TS)(ctx, n.expression);
    return (n.operator === '??') ?
        `(${expr}) != null` :
        `${n.operator}(${expr})`;
};
exports.unaryExpression2TS = unaryExpression2TS;
/**
 * typeAssertion2TS
 */
const typeAssertion2TS = (ctx, n) => `<${(0, exports.type2TS)(n.target)}>(${(0, exports.expression2TS)(ctx, n.expression)})`;
exports.typeAssertion2TS = typeAssertion2TS;
/**
 * viewConstruction2TS
 */
const viewConstruction2TS = (ctx, n) => `${exports.THIS}.registerView(${(0, exports.expression2TS)(ctx, n.expression)}).render()`;
exports.viewConstruction2TS = viewConstruction2TS;
/**
 * funApplication2TS
 */
const funApplication2TS = (ctx, n) => `${(0, exports.expression2TS)(ctx, n.target)}${(0, exports.typeArgs2TS)(n.typeArgs)} ` +
    `(${(0, exports.args2TS)(ctx, n.args)})(${exports.THIS})`;
exports.funApplication2TS = funApplication2TS;
/**
 * constructExpression2TS
 */
const constructExpression2TS = (ctx, n) => {
    let cons = (0, exports.constructor2TS)(n.cons);
    let consOriginal = `${cons[0].toUpperCase()}${cons.slice(1)}`;
    let typeArgs = (0, exports.typeArgs2TS)(n.typeArgs);
    let args = (0, exports.args2TS)(ctx, n.args);
    return (0, array_1.contains)(casters, consOriginal) ?
        `${consOriginal}${typeArgs}(${args})` :
        `new ${cons}${typeArgs}(${args})`;
};
exports.constructExpression2TS = constructExpression2TS;
/**
 * callExpression2TS
 */
const callExpression2TS = (ctx, n) => {
    let target = (0, exports.expression2TS)(ctx, n.target);
    let typeArgs = (0, exports.typeArgs2TS)(n.typeArgs);
    let args = (0, exports.args2TS)(ctx, n.args);
    return `${target}${typeArgs}(${args})`;
};
exports.callExpression2TS = callExpression2TS;
/**
 * typeArgs2TS
 */
const typeArgs2TS = (ns) => (0, array_1.empty)(ns) ? '' : `<${ns.map(exports.type2TS).join(',')}>`;
exports.typeArgs2TS = typeArgs2TS;
/**
 * args2TS converts a list of arguments to a typescript argument tupple.
 */
const args2TS = (ctx, ns) => (ns.length === 0) ? '' : ns.map(e => (0, exports.expression2TS)(ctx, e)).join(',');
exports.args2TS = args2TS;
/**
 * memberExpression2TS
 */
const memberExpression2TS = (ctx, n) => {
    let target = (0, exports.expression2TS)(ctx, n.head);
    return (n.tail instanceof ast.StringLiteral) ?
        `${target}[${(0, exports.string2TS)(n.tail)}]` :
        `${target}.${(0, exports.expression2TS)(ctx, n.tail)}`;
};
exports.memberExpression2TS = memberExpression2TS;
/**
 * functionExpression2TS
 */
const functionExpression2TS = (ctx, n) => {
    let params = n.parameters.map(exports.parameter2TS).join(',');
    let body = (0, exports.expression2TS)(ctx, n.body);
    return `(${params}) => ${body}`;
};
exports.functionExpression2TS = functionExpression2TS;
/**
 * literal2TS
 */
const literal2TS = (ctx, n) => {
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
const boolean2TS = (n) => `${n.value} `;
exports.boolean2TS = boolean2TS;
/**
 * string2TS
 */
const string2TS = (n) => `'${n.value}'`;
exports.string2TS = string2TS;
/**
 * number2TS
 */
const number2TS = (n) => `${parseFloat(n.value)}`;
exports.number2TS = number2TS;
/**
 * record2TS
 */
const record2TS = (ctx, n) => `{${ctx.options.EOL} 
      ${n.properties.map(p => (0, exports.property2TS)(ctx, p)).join(',' + ctx.options.EOL)}
     }`;
exports.record2TS = record2TS;
/**
 * list2TS
 */
const list2TS = (ctx, n) => {
    let mems = n.members.map(e => (0, exports.expression2TS)(ctx, e));
    return `[${ctx.options.EOL}
            ${mems.join(',' + ctx.options.EOL)}
            ]`;
};
exports.list2TS = list2TS;
/**
 * property2TS
 */
const property2TS = (ctx, n) => `'${(0, exports.key2TS)(n.key)}' : ${(0, exports.expression2TS)(ctx, n.value)}`;
exports.property2TS = property2TS;
/**
 * key2TS
 */
const key2TS = (n) => (n instanceof ast.StringLiteral) ? (0, exports.string2TS)(n) : (0, exports.identifier2TS)(n);
exports.key2TS = key2TS;
/**
 * contextProperty2TS
 */
const contextProperty2TS = (n) => {
    let member = (n.member instanceof ast.StringLiteral) ?
        n.member.value :
        (0, exports.identifier2TS)(n.member);
    return `${exports.CONTEXT}.${member}`;
};
exports.contextProperty2TS = contextProperty2TS;
/**
 * contextVariable2TS
 */
const contextVariable2TS = (_) => `${exports.CONTEXT}`;
exports.contextVariable2TS = contextVariable2TS;
/**
 * identifierOrConstructor2TS
 */
const identifierOrConstructor2TS = (n) => {
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
const constructor2TS = (n) => {
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
const unqualifiedConstructor2TS = (n) => toPrim(n.value);
exports.unqualifiedConstructor2TS = unqualifiedConstructor2TS;
/**
 * qualifiedConstructor
 */
const qualifiedConstructor2TS = (n) => `${n.qualifier}.${n.member}`;
exports.qualifiedConstructor2TS = qualifiedConstructor2TS;
/**
 * identifier2TS
 */
const identifier2TS = (n) => {
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
const qualifiedIdentifier2TS = (n) => `${n.qualifier}.${n.member}`;
exports.qualifiedIdentifier2TS = qualifiedIdentifier2TS;
/**
 * unqualifiedIdentifier2TS
 */
const unqualifiedIdentifier2TS = (n) => `${toPrim(n.value)}`;
exports.unqualifiedIdentifier2TS = unqualifiedIdentifier2TS;
const toPrim = (id) => prims.indexOf(id) > -1 ? id.toLowerCase() : id;
//# sourceMappingURL=codegen.js.map