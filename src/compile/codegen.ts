/**
 * Typescript code generator.
 */

/** imports */

import * as ast from '../parse/ast';

import { set } from '@quenk/noni/lib/data/record/path';
import {
    Record,
    merge,
    mapTo,
    reduce,
    isRecord
} from '@quenk/noni/lib/data/record';

import { contains, partition } from '@quenk/noni/lib/data/array';

import { transformTree } from './transform';

export const CONTEXT = '__context';
export const VIEW = '__view';
export const WML = '__wml';
export const DOCUMENT = '__document';
export const THIS = '__this';

const MAYBE = '__Maybe';

const FROM_NULLABLE = '__fromNullable';

const FROM_ARRAY = '__fromArray';

const NODE_PARAMS = `tag:string, attrs:${WML}.Attrs, ` +
    `children: ${WML}.Content[]`;

const WIDGET_PARAMS =
    `w: ${WML}.Widget, attrs:${WML}.Attrs`;

const REGISTER_VIEW_PARAMS = `v:${WML}.View`;

const REGISTER_PARAMS = `e:${WML}.WMLElement, ` +
    `attrs:${WML}.Attributes<any>`;

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

/**
 *  TypeScript code.
 */
export type TypeScript = string;

/**
 * TypeOrMap
 */
export type TypeOrMap = TypeScript | ExpandedTypeMap;

/**
 * TypeMap contains a recursive map of dotted paths to Type nodes.
 */
export interface TypeMap extends Record<ast.Type> { }

/**
 * ExpandedTypeMap is an expanded version of TypeMap.
 *
 * Each dotted path is expanded recursively into records 
 * so that no path contain dots.
 */
export interface ExpandedTypeMap extends Record<TypeOrMap> { }

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

const operators: { [key: string]: string } = {

    '==': '===',

    '!=': '!=='

}

/**
 * CodeGeneratorOptions
 */
export interface CodeGeneratorOptions {

    /**
     * module path that wml types will be imported from in the output.
     */
    module: string,

    /**
     * dom is the module path that the wml DOM api will be imported from in the
     * output.
     */
    dom: string,

    /**
     * EOL character to use when terminating lines.
     */
    EOL: string

}

/**
 * CodeGenerator is the main entry point for turning a parsed ast into
 * Typescript code.
 *
 * Given a parsed tree (starting at ast.Module), its generate method will
 * provide a typescript module.
 */
export class CodeGenerator {

    constructor(public options: CodeGeneratorOptions) { }

    /**
     * create a new CodeGenerator instance.
     */
    static create(opts: CodeGeneratorOptions): CodeGenerator {

        return new CodeGenerator(opts);

    }

    /**
     * generate a Typescript module from an WML AST.
     */
    generate(tree: ast.Module): TypeScript {

        let newTree = transformTree(tree);

        return [

            `import * as ${WML} from '${this.options.module}';`,
            `import * as ${DOCUMENT} from '${this.options.dom}';`,
            imports(this),
            importStatements2TS(this, newTree.imports),
            eol(this),
            typeDefinitions(this),
            eol(this),
            `// @ts-ignore 6192`,
            `const text = ${DOCUMENT}.text;`,
            `// @ts-ignore 6192`,
            `const unsafe = ${DOCUMENT}.unsafe`,
            `// @ts-ignore 6192`,
            `const isSet = (value:any) => value != null`,
            exports2TS(this, newTree.exports)

        ].join(eol(this));

    }

}

const eol = (ctx: CodeGenerator) => `${ctx.options.EOL}`;

const imports = (ctx: CodeGenerator) => [
    `//@ts-ignore: 6192`,
    `import {`,
    `Maybe as ${MAYBE},`,
    `fromNullable as ${FROM_NULLABLE},`,
    `fromArray as ${FROM_ARRAY}`,
    `}`,
    `from '@quenk/noni/lib/data/maybe';`
].join(eol(ctx));

const typeDefinitions = (ctx: CodeGenerator) => [
    `${IGNORE_UNUSED}`,
    `type ${IFARG} = ()=>${WML}.Content[]`,
    ``,
    `${IGNORE_UNUSED}`,
    `type ${FOR_ALT_TYPE} = ()=> ${WML}.Content[]`,
    ``,
    `${IGNORE_UNUSED}`,
    `type ${FOR_IN_BODY} =(val:A, idx:number, all:A[])=>` +
    `${WML}.Content[]`,
    ``,
    `${IGNORE_UNUSED}`,
    `type ${FOR_OF_BODY} = (val:A, key:string, all:object) =>` +
    `${WML}.Content[]`,
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
    `${FOR_ALT_TYPE}) : ${WML}.Content[] => {`,
    ``,
    `   let ret:${WML}.Content[] = [];`,
    ``,
    `   for(let i=0; i<list.length; i++)`,
    `       ret = ret.concat(f(list[i], i, list));`,
    ``,
    `   return ret.length === 0 ? alt() : ret;`,
    ``,
    `}`,
    `${IGNORE_UNUSED}`,
    `const ${FOR_OF} = <A>(o:${RECORD}, f:${FOR_OF_BODY},` +
    `alt:${FOR_ALT_TYPE}) : ${WML}.Content[] => {`,
    ``,
    `    let ret:${WML}.Content[] = [];`,
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
export const importStatements2TS =
    (ctx: CodeGenerator, list: ast.ImportStatement[]): TypeScript =>
        list
            .map(importStatement2TS)
            .filter((stmt, idx, list) => list.indexOf(stmt) == idx)
            .join(`;${eol(ctx)}`);

/**
 * importStatement2TS 
 */
export const importStatement2TS = (n: ast.ImportStatement): TypeScript =>
    `import ${importMember2TS(n.member)} from '${n.module.value.trim()}'; `;

/**
 * importMember2TS
 */
export const importMember2TS = (n: ast.ImportMember): string => {

    if (n instanceof ast.AggregateMember)
        return aggregateMember2TS(n);
    else if (n instanceof ast.AliasedMember)
        return aliasedMember2TS(n);
    else if (n instanceof ast.CompositeMember)
        return compositeMember2TS(n);
    else
        return '';

}

/**
 * aggregateMember2TS
 */
export const aggregateMember2TS = (n: ast.AggregateMember): string =>
    `* as ${identifierOrConstructor2TS(n.id)} `;

/**
 * aliasedMember2TS
 */
export const aliasedMember2TS = (n: ast.AliasedMember): string =>
    `${identifierOrConstructor2TS(n.member)} ` +
    `as ${identifierOrConstructor2TS(n.alias)} `;

/**
 * compositeMember2TS 
 */
export const compositeMember2TS = (n: ast.CompositeMember): string =>
    '{' + (n.members.map(m => (m instanceof ast.AliasedMember) ?
        aliasedMember2TS(m) :
        identifierOrConstructor2TS(m)).join(',')) + '}'

/**
 * exports2TS converts a list of exports to typescript.
 */
export const exports2TS = (ctx: CodeGenerator, list: ast.Export[]) =>
    list.map(e => export2TS(ctx, e)).join(';' + eol(ctx));

/**
 * export2TS 
 */
export const export2TS = (ctx: CodeGenerator, n: ast.Export) => {

    if (n instanceof ast.AliasStatement)
        return aliasStatement2TS(n);
    else if (n instanceof ast.ContextStatement)
        return contextStatement2TS(n);
    else if (n instanceof ast.LetStatement)
        return letStatement2TS(ctx, n);
    else if (n instanceof ast.FunStatement)
        return funStatement2TS(ctx, n);
    else if (n instanceof ast.ViewStatement)
        return viewStatement2TS(ctx, n);
    else if ((n instanceof ast.Widget) || (n instanceof ast.Node))
        return tag2TS(ctx, n);
    else
        return '';

}

/**
 * aliasStatement2TS
 */
export const aliasStatement2TS = (n: ast.AliasStatement) => {

    let typeArgs = (n.typeParameters.length > 0) ?
        typeParameters2TS(n.typeParameters) : '';

    let preamble = `export type ${n.id.value}${typeArgs}`;

    let members = n.members.map(m => type2TS(m)).join('|');

    return `${preamble} = ${members};`;

}

/**
 * contextStatement2TS
 */
export const contextStatement2TS = (n: ast.ContextStatement) => {

    let preamble = `export interface ${n.id.value}`;

    let typeArgs = (n.typeParameters.length > 0) ?
        typeParameters2TS(n.typeParameters) : '';

    let [parents, members] = partition(n.members, member =>
        member instanceof ast.ConstructorType);

    let parentList = (<ast.ConstructorType[]>parents)
        .map(constructorType2TS).join(',');

    parentList = (parentList !== '') ? ` extends ${parentList}` : '';

    return [
        preamble,
        typeArgs,
        parentList,
        '{',
        memberDeclarations2TS(<ast.MemberDeclaration[]>members),
        '}'
    ].join('');

}

/**
 * letStatement2TS
 */
export const letStatement2TS =
    (ctx: CodeGenerator, n: ast.LetStatement) =>
        _setStatement2TS(ctx, n, 'export const');

const _setStatement2TS =
    (ctx: CodeGenerator, n: ast.LetStatement, preamble: string) => {

        let id = identifier2TS(n.id);

        let cons = constructorType2TS(n.cons);

        preamble = `${preamble} ${id}:${cons}`;

        let value = expression2TS(ctx, n.expression);

        return `${preamble} = ${value}`;

    }

/**
 * funStatement2TS generates Typescript output for fun statements.
 *
 * This is a curried function that first accepts zero or more arguments then
 * a single Registry, finally the content.
 */
export const funStatement2TS = (ctx: CodeGenerator, n: ast.FunStatement) => {

    let id = unqualifiedIdentifier2TS(n.id);

    let typeParams = typeParameters2TS(n.typeParameters);

    let params = parameters2TS(n.parameters);

    let factory = `(${THIS}:${WML}.Registry) : ${WML}.Content[] =>`;

    let body = children2TS(ctx, n.body);

    return [

        `export const ${id} = `,
        ``,
        `${typeParams}(${params})=>${factory} {`,
        ``,
        `   return ${body};`,
        ``,
        `};`

    ].join(eol(ctx));

}

/**
 * viewStatement2TS converts a ViewStatement to its typescript form.
 *
 * This is a class with template and various useful helpers.
 */
export const viewStatement2TS = (ctx: CodeGenerator, n: ast.ViewStatement) => {

    let instances = n.directives.map(i =>
        _setStatement2TS(ctx, i, 'let')).join(`;${ctx.options.EOL}`);

    let id = n.id ? constructor2TS(n.id) : 'Main';

    let typeParams = typeParameters2TS(n.typeParameters);

    let context = type2TS((n.context instanceof ast.ContextFromStatement) ?
    n.context.cons : <ast.ConstructorType>n.context);

    let template = tag2TS(ctx, n.root);

    return [

        `export class ${id} ${typeParams} implements ${WML}.View {`,
        ``,
        `   constructor(${CONTEXT}: ${context}) {`,
        ``,
        `       this.template = (${THIS}:${WML}.Registry) => {`,
        ``,
        `       ${instances}`,
        ``,
        `           return ${template};`,
        ``,
        `       }`,
        ``,
        `   }`,
        ``,
        `   ids: { [key: string]: ${WML}.WMLElement } = {};`,
        ``,
        `   groups: { [key: string]: ${WML}.WMLElement[] } = {};`,
        ``,
        `   views: ${WML}.View[] = [];`,
        ``,
        `   widgets: ${WML}.Widget[] = [];`,
        ``,
        `   tree: Node = <Node>${DOCUMENT}.createElement('div');`,
        ``,
        `   template: ${WML}.Template;`,
        ``,
        `   registerView(${REGISTER_VIEW_PARAMS}) : ${WML}.View {`,
        ``,
        `       this.views.push(v);`,
        ``,
        `       return v;`,
        ``,
        `}`,
        `   register(${REGISTER_PARAMS}) : ${WML}.WMLElement {`,
        ``,
        `       let attrsMap = (<${WML}.Attrs><any>attrs)`,
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
        `   node(${NODE_PARAMS}): ${WML}.Content {`,
        ``,
        `       let e = ${DOCUMENT}.createElement(tag);`,
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
        `           } else if(!${DOCUMENT}.isBrowser && `,
        `                     value instanceof ${DOCUMENT}.WMLDOMText) {`,
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
        `                     let tn = ${DOCUMENT}.createTextNode(''+c);`,
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
        `   widget(${WIDGET_PARAMS}) : ${WML}.Content {`,
        ``,
        `       this.register(w, attrs);`,
        ``,
        `       this.widgets.push(w);`,
        ``,
        `       return w.render();`,
        ``,
        `   }`,
        ``,
        `   findById<E extends ${WML}.WMLElement>(id: string): ${MAYBE}<E> {`,
        ``,
        `       let mW:${MAYBE}<E> = ${FROM_NULLABLE}<E>(<E>this.ids[id])`,
        ``,
        `       return this.views.reduce((p,c)=>`,
        `       p.isJust() ? p : c.findById(id), mW);`,
        ``,
        `   }`,
        ``,
        `   findByGroup<E extends ${WML}.WMLElement>(name: string): ` +
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
        `   render(): ${WML}.Content {`,
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

    ].join(eol(ctx))

}

/**
 * typeParameters2TS converts a list of typeParameters2TS into the a list of 
 * typescript typeParameters2TS.
 */
export const typeParameters2TS = (ns: ast.TypeParameter[]): string =>
    (ns.length === 0) ? '' : `<${ns.map(typeParameter2TS).join(',')}> `;

/**
 * typeParameter2TS converts a type parameter into a typescript type parameter.
 */
export const typeParameter2TS = (n: ast.TypeParameter) =>
    `${toPrim(identifierOrConstructor2TS(n.id))} ` +
    `${n.constraint ? 'extends ' + type2TS(n.constraint) : ''} `;

/**
 * type2TS 
 */
export const type2TS = (n: ast.Type): TypeScript => {

    if (n instanceof ast.ConstructorType)
        return constructorType2TS(n);
    else if (n instanceof ast.RecordType)
        return recordType2Ts(n);
    else if (n instanceof ast.ListType)
        return listType2TS(n);
    else if (n instanceof ast.TupleType)
        return tupleType2TS(n);
    else if (n instanceof ast.StringLiteral)
        return string2TS(n);
    else if (n instanceof ast.NumberLiteral)
        return number2TS(n);
    else if (n instanceof ast.BooleanLiteral)
        return boolean2TS(n);
    else if (n instanceof ast.FunctionType)
        return functionType2TS(n);

    return '<error>';

}

/**
 * constructorType2TS converts a ConstructorType into its id.
 *
 * If the node is generic, the type parameters will be generated as well.
 */
export const constructorType2TS =
    (n: ast.ConstructorType) => {

        let id = toPrim(identifierOrConstructor2TS(n.id));

        return (n.typeParameters.length > 0) ?
            id + typeParameters2TS(n.typeParameters) : id;

    }

/**
 * functionType2TS
 */
export const functionType2TS = (n: ast.FunctionType) => {

    let params = n.parameters.map((t, k) => `$${k}:${type2TS(t)}`).join(',');
    let ret = type2TS(n.returnType);

    return `(${params}) => ${ret}`

}

/**
 * listType2TS
 */
export const listType2TS = (n: ast.ListType) =>
    `(${type2TS(n.elementType)})[]`;

/**
 * tupleType2TS
 */
export const tupleType2TS = (n: ast.TupleType) =>
    `[${n.members.map(type2TS).join(',')}]`;

/**
 * recordType2TS converts the RecordType node to the body of a TypeScript
 * record interface.
 */
export const recordType2Ts = (n: ast.RecordType) =>
    '{' + memberDeclarations2TS(n.members) + '}';

/**
 * memberDeclarations2TS converts a list of MemberDeclarations to TypeScript.
 *
 * The paths of the MemberDeclarations are expanded so that paths
 * using the "<path1>.<path2>.<path3>" syntax occur as nested records.
 */
export const memberDeclarations2TS = (n: ast.MemberDeclaration[]) =>
    typeMap2TS(expandTypeMap(typeMapFromMemberDecs(n)));

/**
 * typeMapFromMemberDecs creates a TypeMap from a list of memberDeclarations.
 *
 * This works recursively and any RecordTypes encountered will be flattened.
 */
export const typeMapFromMemberDecs =
    (list: ast.MemberDeclaration[]) =>
        list.reduce((p, m) => {

            let paths = m.path.map(p => p.value);

            if (m.kind instanceof ast.RecordType) {

                return typeMapFromRecordType(m.kind, p, paths);

            } else {

                let path = paths2String(paths);

                path = m.optional ? `${path}?` : path;

                p[path] = m.kind;

                return p;

            }

        }, <TypeMap>{});

/**
 * typeMapFromRecordType produces a map of node.Type instances from
 * a RecordType recursively.
 *
 * Any encountered RecordTypes will be flattened.
 */
export const typeMapFromRecordType =
    (n: ast.RecordType, init: TypeMap, prefix: string[]): TypeMap =>
        n.members.reduce((p, m) => {

            let path = [...prefix, ...(m.path.map(p => p.value))];

            if (m.kind instanceof ast.RecordType) {

                return typeMapFromRecordType(m.kind, init, path);

            } else {

                p[paths2String(path)] = m.kind;

                return p;

            }

        }, init);

const paths2String = (paths: string[]) => paths.join('.');

/**
 * expandTypeMap to an ExpandedTypeMap.
 */
export const expandTypeMap = (m: TypeMap): ExpandedTypeMap =>
    reduce(m, <ExpandedTypeMap>{}, (p, c, k) =>
        set<TypeOrMap, ExpandedTypeMap>(k, type2TS(c), p));

/**
 * typeMap2TS converts a map of type values to TypeScript.
 */
export const typeMap2TS = (m: ExpandedTypeMap): TypeScript =>
    mapTo(m, (t, k) => {

        if (isRecord(t)) {

            let key = isOptional(t) ? `${k}?` : `${k}`;
            return `${key}: {${typeMap2TS(t)}}`;

        } else {

            return `${k} : ${t}`;

        }
    }).join(',\n');

const isOptional = (m: ExpandedTypeMap) =>
    reduce(m, false, (p, _, k) => p ? p : k.indexOf('?') > - 1);

/**
 * parameters2TS converts a list Parameter nodes into an parameter list
 * (without parens).
 */
export const parameters2TS = (list: ast.Parameter[]) =>
    list.map(p => parameter2TS(p)).join(',');

/**
 * parameter2TS 
 */
export const parameter2TS = (n: ast.Parameter) => {

    if (n instanceof ast.TypedParameter)
        return typedParameter2TS(n)
    else if (n instanceof ast.UntypedParameter)
        return untypedParameter2TS(n)
    else
        return '';

}

/**
 * typedParameter2TS 
 */
export const typedParameter2TS = (n: ast.TypedParameter) =>
    `${identifier2TS(n.id)}: ${type2TS(n.hint)} `;

/**
 * untypedParameter2TS 
 */
export const untypedParameter2TS = (n: ast.UntypedParameter) =>
    `${identifier2TS(n.id)} `;

/**
 * children2TS
 */
export const children2TS = (ctx: CodeGenerator, list: ast.Child[]) =>
    `[${ctx.options.EOL}
        ${list.map(l => child2TS(ctx, l)).join(',' + ctx.options.EOL)}
     ]`;

/**
 * child2TS converts children to typescript.
 */
export const child2TS = (ctx: CodeGenerator, n: ast.Child): string => {

    if ((n instanceof ast.Node) || (n instanceof ast.Widget))
        return tag2TS(ctx, n);
    else if (n instanceof ast.Interpolation)
        return interpolation2TS(ctx, n);
    else if (n instanceof ast.IfStatement)
        return ifStatement2TS(ctx, n);
    else if (n instanceof ast.ForInStatement)
        return forInStatement2TS(ctx, n);
    else if (n instanceof ast.ForOfStatement)
        return forOfStatement2TS(ctx, n);
    else if (n instanceof ast.ForFromStatement)
        return forFromStatement2TS(ctx, n);
    else if (n instanceof ast.Characters)
        return characters2TS(n);
    else if (n instanceof ast.ContextProperty)
        return contextProperty2TS(n);
    else if (n instanceof ast.QualifiedConstructor)
        return qualifiedConstructor2TS(n);
    else if (n instanceof ast.UnqualifiedConstructor)
        return unqualifiedConstructor2TS(n);
    else if (n instanceof ast.UnqualifiedIdentifier)
        return unqualifiedIdentifier2TS(n);
    else if (n instanceof ast.QualifiedIdentifier)
        return qualifiedIdentifier2TS(n);
    else
        return '';

}

/**
 * tag2TS converts a tag to typescript.
 */
export const tag2TS = (ctx: CodeGenerator, n: ast.Tag) => (n.type === 'widget') ?
    widget2TS(ctx, n) : node2TS(ctx, n);

/**
 * widget2TS converts a Widget node into its typescript representation.
 *
 * This is simply a call to the View's widget method.
 */
export const widget2TS = (ctx: CodeGenerator, n: ast.Widget) => {

    let name = constructor2TS(n.open);
    let attrs = attrs2String(groupAttrs(ctx, n.attributes));
    let childs = children2TS(ctx, n.children);

    return `${THIS}.widget(new ${name}(${attrs}, ${childs}),` +
        `<${WML}.Attrs>${attrs})`;

}

/**
 * node2TS converts a Node into its typescript representation.
 *
 * This is simply a call to the View's node method.
 */
export const node2TS = (ctx: CodeGenerator, n: ast.Node) => {

    let name = identifier2TS(n.open);
    let attrs = attrs2String(groupAttrs(ctx, n.attributes));
    let childs = children2TS(ctx, n.children);

    return `${THIS}.node('${name}', <${WML}.Attrs>${attrs}, ${childs})`;

}

/**
 * attribute2Value 
 */
export const attribute2TS = (ctx: CodeGenerator, n: ast.Attribute) =>
    `${attributeName2TS(ctx, n)} : ${attributeValue2TS(ctx, n)} `;

/**
 * attributeValue2TS
 */
export const attributeValue2TS =
    (ctx: CodeGenerator, n: ast.Attribute) =>
        (n.value instanceof ast.Interpolation) ?
            interpolation2TS(ctx, n.value) :
            literal2TS(ctx, n.value);

/**
 * attributeName2TS
 */
export const attributeName2TS = (_: CodeGenerator, n: ast.Attribute) =>
    `'${unqualifiedIdentifier2TS(n.name)}'`;

/**
 * attrs2String 
 */
export const attrs2String = (attrs: { [key: string]: string | string[] }) =>
    '{' +
    Object.keys(attrs).map(name =>
        Array.isArray(attrs[name]) ?
            `${name} : { ${(<string[]>attrs[name]).join(',')} }` :
            `${name}: ${attrs[name]}`) +
    '}';

/**
 * groupAttrs
 */
export const groupAttrs = (ctx: CodeGenerator, attrs: ast.Attribute[])
    : { [key: string]: string | string[] } => {

    let [nns, ns] = partition(attrs, a => (a.namespace.value === ''));

    let nso = ns.reduce((p, n) => merge(p, {

        [n.namespace.value]: (p[n.namespace.value] || []).concat(attribute2TS(ctx, n))

    }), <{ [key: string]: string[] }>{});

    return nns.reduce((p, n) => merge(p, {

        [attributeName2TS(ctx, n)]: attributeValue2TS(ctx, n)

    }), <{ [key: string]: string | string[] }>nso);

}

/**
 * interpolation2TS 
 */
export const interpolation2TS = (ctx: CodeGenerator, n: ast.Interpolation) =>
    n.filters.reduce((p, c) =>
        `${expression2TS(ctx, c)} (${p})`, expression2TS(ctx, n.expression));

/**
 * ifStatementTS converts an IfStatement to its typescript representation.
 */
export const ifStatement2TS =
    (ctx: CodeGenerator, n: ast.IfStatement): TypeScript => {

        let condition = expression2TS(ctx, n.condition);
        let conseq = children2TS(ctx, n.then);

        let alt = (n.elseClause instanceof ast.ElseIfClause) ?
            `[${ifStatement2TS(ctx, n.elseClause)}]` :
            (n.elseClause instanceof ast.ElseClause) ?
                children2TS(ctx, n.elseClause.children) :
                '[]';

        return [
            `...((${condition}) ?`,
            `(()=>(${conseq}))() :`,
            `(()=>(${alt}))())`
        ].join(ctx.options.EOL);

    }

/**
 * forInStatement2TS converts a ForInStatement to its typescript representation.
 */
export const forInStatement2TS = (ctx: CodeGenerator, n: ast.ForInStatement) => {

    let expr = expression2TS(ctx, n.expression);

    let value = parameter2TS(n.variables[0]);

    let key = n.variables.length > 1 ? parameter2TS(n.variables[1]) : '_$$i';

    let all = n.variables.length > 2 ? parameter2TS(n.variables[2]) : '_$$all';

    let body = children2TS(ctx, n.body);

    let alt = n.otherwise.length > 0 ? children2TS(ctx, n.otherwise) : '[]';

    return [
        `...${FOR_IN} (${expr}, (${value}, ${key}, ${all})=> `,
        `(${body}), `,
        `()=> (${alt}))`
    ].join(ctx.options.EOL);

}

/**
 * forOfStatement2TS
 */
export const forOfStatement2TS = (ctx: CodeGenerator, n: ast.ForOfStatement) => {

    let expr = expression2TS(ctx, n.expression);

    let value = parameter2TS(n.variables[0]);

    let key = n.variables.length > 1 ? parameter2TS(n.variables[1]) : '_$$k';

    let all = n.variables.length > 2 ? parameter2TS(n.variables[2]) : '_$$all';

    let body = children2TS(ctx, n.body);

    let alt = n.otherwise.length > 0 ? children2TS(ctx, n.otherwise) : '[]';

    return [
        `...${FOR_OF} (${expr}, (${value}, ${key}, ${all}) => `,
        `       (${body}), `,
        `    ()=> (${alt}))`
    ].join(eol(ctx));

}

/**
 * forFromStatement2TS
 */
export const forFromStatement2TS =
    (ctx: CodeGenerator, node: ast.ForFromStatement) => {

        let value = parameter2TS(node.variable);

        let start = expression2TS(ctx, node.start);

        let end = expression2TS(ctx, node.end);

        let body = children2TS(ctx, node.body);

        return [
            `...(function forFrom()  {`,
            `  let result:${WML}.Content[] = [];`,
            `  for(let ${value}:number=${start}; ${value}<=${end}; ${value}++)`,
            `   result.push(`,
            `     ...${body}`,
            `   );`,
            `  return result;`,
            `})()`
        ].join(eol(ctx));

    }

/**
 * characters2TS converts character text to a typescript string.
 */
export const characters2TS = (n: ast.Characters) =>
    `${DOCUMENT}.createTextNode('${breakLines(n.value)}')`;

const breakLines = (str: string) => str.split('\n').join('\\u000a');

/**
 * expression2TS 
 */
export const expression2TS = (ctx: CodeGenerator, n: ast.Expression): string => {

    if (n instanceof ast.IfThenExpression)
        return ifThenExpression2TS(ctx, n)
    else if (n instanceof ast.BinaryExpression)
        return binaryExpression2TS(ctx, n)
    else if (n instanceof ast.UnaryExpression)
        return unaryExpression2TS(ctx, n);
    else if (n instanceof ast.TypeAssertion)
        return typeAssertion2TS(ctx, n);
    else if (n instanceof ast.ViewConstruction)
        return viewConstruction2TS(ctx, n);
    else if (n instanceof ast.FunApplication)
        return funApplication2TS(ctx, n);
    else if (n instanceof ast.ConstructExpression)
        return constructExpression2TS(ctx, n);
    else if (n instanceof ast.CallExpression)
        return callExpression2TS(ctx, n);
    else if (n instanceof ast.MemberExpression)
        return memberExpression2TS(ctx, n);
    else if (n instanceof ast.FunctionExpression)
        return functionExpression2TS(ctx, n);
    else if (n instanceof ast.Record)
        return record2TS(ctx, n)
    else if (n instanceof ast.List)
        return list2TS(ctx, n)
    else if (n instanceof ast.BooleanLiteral)
        return boolean2TS(n);
    else if (n instanceof ast.NumberLiteral)
        return number2TS(n);
    else if (n instanceof ast.StringLiteral)
        return string2TS(n);
    else if (n instanceof ast.ContextProperty)
        return contextProperty2TS(n);
    else if (n instanceof ast.QualifiedConstructor)
        return qualifiedConstructor2TS(n);
    else if (n instanceof ast.UnqualifiedConstructor)
        return unqualifiedConstructor2TS(n);
    else if (n instanceof ast.UnqualifiedIdentifier)
        return unqualifiedIdentifier2TS(n);
    else if (n instanceof ast.QualifiedIdentifier)
        return qualifiedIdentifier2TS(n);
    else if (n instanceof ast.ContextVariable)
        return contextVariable2TS(n);
    else
        return '';

}

/**
 * ifThenExpression2TS 
 */
export const ifThenExpression2TS = (ctx: CodeGenerator, n: ast.IfThenExpression) => {

    let condition = expression2TS(ctx, n.condition);
    let conseq = expression2TS(ctx, n.iftrue);
    let alt = expression2TS(ctx, n.iffalse);

    return `(${condition}) ? ${conseq} :  ${alt}`;

}

/**
 * binaryExpression2TS 
 */
export const binaryExpression2TS = (ctx: CodeGenerator, n: ast.BinaryExpression) => {

    let left = expression2TS(ctx, n.left);
    let right = expression2TS(ctx, n.right);

    let op = operators.hasOwnProperty(n.operator) ?
        operators[n.operator] :
        n.operator;

    return `(${left} ${op} ${right})`;

}

/**
 * unaryExpression2TS 
 */
export const unaryExpression2TS =
    (ctx: CodeGenerator, n: ast.UnaryExpression) => {

        let expr = expression2TS(ctx, n.expression);

        return (n.operator === '??') ?
            `(${expr}) != null` :
            `${n.operator}(${expr})`;

    }

/**
 * typeAssertion2TS
 */
export const typeAssertion2TS = (ctx: CodeGenerator, n: ast.TypeAssertion) =>
    `<${type2TS(n.target)}>(${expression2TS(ctx, n.expression)})`;

/**
 * viewConstruction2TS 
 */
export const viewConstruction2TS = (ctx: CodeGenerator, n: ast.ViewConstruction) =>
    `${THIS}.registerView(${expression2TS(ctx, n.expression)}).render()`;

/**
 * funApplication2TS 
 */
export const funApplication2TS = (ctx: CodeGenerator, n: ast.FunApplication) =>
    `${expression2TS(ctx, n.target)}${typeArgs2TS(n.typeArgs)} ` +
    `(${args2TS(ctx, n.args)})(${THIS})`;

/**
 * constructExpression2TS 
 */
export const constructExpression2TS =
    (ctx: CodeGenerator, n: ast.ConstructExpression) => {

        let cons = constructor2TS(n.cons);

        let consOriginal = `${cons[0].toUpperCase()}${cons.slice(1)}`;

        let args = args2TS(ctx, n.args);

        if (contains(casters, consOriginal)) {

            return `${consOriginal}(${args})`;

        } else {

            return `new ${cons}(${args})`;

        }

    }

/**
 * callExpression2TS 
 */
export const callExpression2TS = (ctx: CodeGenerator, n: ast.CallExpression) => {

    let target = expression2TS(ctx, n.target);
    let typeArgs = typeArgs2TS(n.typeArgs);
    let args = args2TS(ctx, n.args);

    return `${target}${typeArgs}(${args})`;

}

/**
 * typeArgs2TS 
 */
export const typeArgs2TS = (ns: ast.Type[]) =>
    ns.length === 0 ? '' : `<${ns.map(type2TS).join(',')}>`;

/**
 * args2TS converts a list of arguments to a typescript argument tupple.
 */
export const args2TS = (ctx: CodeGenerator, ns: ast.Expression[]) =>
    (ns.length === 0) ? '' : ns.map(e => expression2TS(ctx, e)).join(',');

/**
 * memberExpression2TS 
 */
export const memberExpression2TS =
    (ctx: CodeGenerator, n: ast.MemberExpression) => {
        let target = expression2TS(ctx, n.target);

        return (n.member instanceof ast.StringLiteral) ?
            `${target}[${string2TS(n.member)}]` :
            `${target}.${identifier2TS(n.member)}`;
    }

/**
 * functionExpression2TS
 */
export const functionExpression2TS =
    (ctx: CodeGenerator, n: ast.FunctionExpression) => {

        let params = n.parameters.map(parameter2TS).join(',');
        let body = expression2TS(ctx, n.body);

        return `(${params}) => ${body}`;

    }

/**
 * literal2TS 
 */
export const literal2TS = (ctx: CodeGenerator, n: ast.Literal) => {

    if (n instanceof ast.BooleanLiteral)
        return boolean2TS(n);
    else if (n instanceof ast.StringLiteral)
        return string2TS(n);
    else if (n instanceof ast.NumberLiteral)
        return number2TS(n);
    else if (n instanceof ast.Record)
        return record2TS(ctx, n);
    else if (n instanceof ast.List)
        return list2TS(ctx, n);
    else
        return '';

}

/**
 * boolean2TS 
 */
export const boolean2TS = (n: ast.BooleanLiteral) => `${n.value} `;

/**
 * string2TS
 */
export const string2TS = (n: ast.StringLiteral) => `'${n.value}'`;

/**
 * number2TS 
 */
export const number2TS = (n: ast.NumberLiteral) => `${parseFloat(n.value)}`;

/**
 * record2TS
 */
export const record2TS = (ctx: CodeGenerator, n: ast.Record) =>
    `{${ctx.options.EOL} 
      ${n.properties.map(p => property2TS(ctx, p)).join(',' + ctx.options.EOL)}
     }`;

/**
 * list2TS
 */
export const list2TS = (ctx: CodeGenerator, n: ast.List) => {

    let mems = n.members.map(e => expression2TS(ctx, e));

    return `[${ctx.options.EOL}
            ${mems.join(',' + ctx.options.EOL)}
            ]`;

}

/**
 * property2TS
 */
export const property2TS = (ctx: CodeGenerator, n: ast.Property) =>
    `'${key2TS(n.key)}' : ${expression2TS(ctx, n.value)}`;

/**
 * key2TS 
 */
export const key2TS = (n: ast.StringLiteral | ast.UnqualifiedIdentifier) =>
    (n instanceof ast.StringLiteral) ? string2TS(n) : identifier2TS(n);

/**
 * contextProperty2TS 
 */
export const contextProperty2TS = (n: ast.ContextProperty) => {
    let member = (n.member instanceof ast.StringLiteral) ?
        n.member.value :
        identifier2TS(n.member);

    return `${CONTEXT}.${member}`;

}

/**
 * contextVariable2TS 
 */
export const contextVariable2TS = (_: ast.ContextVariable) => `${CONTEXT}`;

/**
 * identifierOrConstructor2TS
 */
export const identifierOrConstructor2TS =
    (n: ast.Identifier | ast.Constructor) => {

        if ((n instanceof ast.UnqualifiedIdentifier) ||
            (n instanceof ast.QualifiedIdentifier))
            return identifier2TS(n);
        else if ((n instanceof ast.UnqualifiedConstructor) ||
            (n instanceof ast.QualifiedConstructor))
            return constructor2TS(n);
        else
            return '';

    }

/**
 * constructor2TS 
 */
export const constructor2TS = (n: ast.Constructor) => {

    if (n instanceof ast.QualifiedConstructor)
        return qualifiedConstructor2TS(n);
    else if (n instanceof ast.UnqualifiedConstructor)
        return unqualifiedConstructor2TS(n);
    else
        return '';

}

/**
 * unqualifiedConstructor2TS 
 */
export const unqualifiedConstructor2TS = (n: ast.UnqualifiedConstructor) =>
    toPrim(n.value);

/**
 * qualifiedConstructor
 */
export const qualifiedConstructor2TS = (n: ast.QualifiedConstructor) =>
    `${n.qualifier}.${n.member}`;

/**
 * identifier2TS
 */
export const identifier2TS = (n: ast.Identifier) => {

    if (n instanceof ast.QualifiedIdentifier)
        return qualifiedIdentifier2TS(n)
    else if (n instanceof ast.UnqualifiedIdentifier)
        return unqualifiedIdentifier2TS(n)
    else
        return ''

}

/**
 * qualifiedIdentifier2TS 
 */
export const qualifiedIdentifier2TS = (n: ast.QualifiedIdentifier) =>
    `${n.qualifier}.${n.member}`;

/**
 * unqualifiedIdentifier2TS 
 */
export const unqualifiedIdentifier2TS = (n: ast.UnqualifiedIdentifier) =>
    `${toPrim(n.value)}`;

const toPrim = (id: string) => prims.indexOf(id) > -1 ? id.toLowerCase() : id;
