/**
 * output typescript code
 */

/** imports */

import * as nodes from '../../../parse/ast';

import { set } from '@quenk/noni/lib/data/record/path';
import {
    Record,
    merge,
    mapTo,
    reduce,
    isRecord
} from '@quenk/noni/lib/data/record';

import { Code, Context } from '../../code';
import { partition } from '@quenk/noni/lib/data/array';

export const CONTEXT = '__context';
export const VIEW = '__view';
export const WML = '__wml';
export const DOCUMENT = '__document';
export const THIS = '__this';

type Ifs = nodes.IfStatement | nodes.ElseIfClause;

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
export interface TypeMap extends Record<nodes.Type> { }

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
 * eol sugar
 */
export const eol = (ctx: Context) => `${ctx.options.EOL}`;

/**
 * module2TS outputs the compiled contents of a module
 * as a typescript module.
 */
export const module2TS = (ctx: Context, n: nodes.Module): Code =>

    `import * as ${WML} from '${ctx.options.module}';${eol(ctx)}` +
    `import * as ${DOCUMENT} from '${ctx.options.dom}';${eol(ctx)}` +
    eol(ctx) +
    `${n.imports.map(importStatement2TS).join(';' + eol(ctx))}` +
    eol(ctx) +
    `${ctx.generator.imports(ctx)}` +
    eol(ctx) +
    `${ctx.generator.definitions(ctx)}` +
    eol(ctx) +
    `${n.exports.map(e => exports2TS(ctx, e)).join(';' + eol(ctx))}`;

/**
 * importStatement2TS 
 */
export const importStatement2TS = (n: nodes.ImportStatement): Code =>
    `import ${importMember2TS(n.member)} from '${n.module.value}'; `;

/**
 * importMember2TS
 */
export const importMember2TS = (n: nodes.ImportMember): string => {

    if (n instanceof nodes.AggregateMember)
        return aggregateMember2TS(n);
    else if (n instanceof nodes.AliasedMember)
        return aliasedMember2TS(n);
    else if (n instanceof nodes.CompositeMember)
        return compositeMember2TS(n);
    else
        return '';

}

/**
 * aggregateMember2TS
 */
export const aggregateMember2TS = (n: nodes.AggregateMember): string =>
    `* as ${identifierOrConstructor2TS(n.id)} `;

/**
 * aliasedMember2TS
 */
export const aliasedMember2TS = (n: nodes.AliasedMember): string =>
    `${identifierOrConstructor2TS(n.member)} ` +
    `as ${identifierOrConstructor2TS(n.alias)} `;

/**
 * compositeMember2TS 
 */
export const compositeMember2TS = (n: nodes.CompositeMember): string =>
    '{' + (n.members.map(m => (m instanceof nodes.AliasedMember) ?
        aliasedMember2TS(m) :
        identifierOrConstructor2TS(m)).join(',')) + '}'

/**
 * exports2TS 
 */
export const exports2TS = (ctx: Context, n: nodes.Export) => {

    if (n instanceof nodes.AliasStatement)
        return aliasStatement2TS(n);
    else if (n instanceof nodes.ContractStatement)
        return contractStatement2TS(n);
    else if (n instanceof nodes.FunStatement)
        return funStatement2TS(ctx, n);
    else if (n instanceof nodes.ViewStatement)
        return viewStatement2TS(ctx, n);
    else if ((n instanceof nodes.Widget) || (n instanceof nodes.Node))
        return tag2TS(ctx, n);
    else
        return '';

}

/**
 * aliasStatement2TS
 */
export const aliasStatement2TS = (n: nodes.AliasStatement) => {

    let typeArgs = (n.typeParameters.length > 0) ?
        typeParameters2TS(n.typeParameters) : '';

    let preamble = `export type ${n.id.value}${typeArgs}`;

    let members = n.members.map(m => type2TS(m)).join('|');

    return `${preamble} = ${members};`;

}

/**
 * contractStatement2TS
 */
export const contractStatement2TS = (n: nodes.ContractStatement) => {

    let preamble = `export interface ${n.id.value}`;

    let typeArgs = (n.typeParameters.length > 0) ?
        typeParameters2TS(n.typeParameters) : '';

    return `${preamble}${typeArgs}{${memberDeclarations2TS(n.members)} }`;

}

/**
 * funStatement2TS 
 */
export const funStatement2TS = (ctx: Context, n: nodes.FunStatement) =>
    ctx.generator.fun(ctx, n);

/**
 * viewStatement2TS.
 */
export const viewStatement2TS = (ctx: Context, n: nodes.ViewStatement) =>
    ctx.generator.view(ctx, n);

/**
 * typeParameters2TS converts a list of typeParameters2TS into the a list of 
 * typescript typeParameters2TS.
 */
export const typeParameters2TS = (ns: nodes.TypeParameter[]): string =>
    (ns.length === 0) ? '' : `<${ns.map(typeParameter2TS).join(',')}> `;

/**
 * typeParameter2TS converts a type parameter into a typescript type parameter.
 */
export const typeParameter2TS = (n: nodes.TypeParameter) =>
    `${identifierOrConstructor2TS(n.id)} ` +
    `${n.constraint ? 'extends ' + type2TS(n.constraint) : ''} `;

/**
 * type2TS 
 */
export const type2TS = (n: nodes.Type): TypeScript => {

    if (n instanceof nodes.ConstructorType)
        return constructorType2TS(n);
    else if (n instanceof nodes.RecordType)
        return recordType2Ts(n);
    else if (n instanceof nodes.ListType)
        return listType2TS(n);
    else if (n instanceof nodes.FunctionType)
        return functionType2TS(n);

    return '';

}

/**
 * constructorType2TS converts a ConstructorType into its id.
 *
 * If the node is generic, the type parameters will be generated as well.
 */
export const constructorType2TS =
    (n: nodes.ConstructorType) => {

        let id = identifierOrConstructor2TS(n.id);

        id = prims.indexOf(id) > - 1 ? id.toLowerCase() : id;

        return (n.typeParameters.length > 0) ?
            id + typeParameters2TS(n.typeParameters) : id;

    }

/**
 * functionType2TS
 */
export const functionType2TS = (n: nodes.FunctionType) => {

    let params = n.parameters.map((t, k) => `$${k}:${type2TS(t)}`).join(',');
    let ret = type2TS(n.returnType);

    return `(${params}) => ${ret}`

}

/**
 * listType2TS
 */
export const listType2TS = (n: nodes.ListType) =>
    `(${type2TS(n.elementType)})[]`;

/**
 * recordType2TS converts the RecordType node to the body of a TypeScript
 * record interface.
 */
export const recordType2Ts = (n: nodes.RecordType) =>
    '{' + memberDeclarations2TS(n.members) + '}';

/**
 * memberDeclarations2TS converts a list of MemberDeclarations to TypeScript.
 *
 * The paths of the MemberDeclarations are expanded so that paths
 * using the "<path1>.<path2>.<path3>" syntax occur as nested records.
 */
export const memberDeclarations2TS = (n: nodes.MemberDeclaration[]) =>
    typeMap2TS(expandTypeMap(typeMapFromMemberDecs(n)));

/**
 * typeMapFromMemberDecs creates a TypeMap from a list of memberDeclarations.
 *
 * This works recursively and any RecordTypes encountered will be flattened.
 */
export const typeMapFromMemberDecs =
    (list: nodes.MemberDeclaration[]) =>
        list.reduce((p, m) => {

            let path = m.path.map(p => p.value);

            if (m.kind instanceof nodes.RecordType) {

                return typeMapFromRecordType(m.kind, p, path);

            } else {

                p[paths2String(path)] = m.kind;

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
    (n: nodes.RecordType, init: TypeMap, prefix: string[]): TypeMap =>
        n.members.reduce((p, m) => {

            let path = [...prefix, ...(m.path.map(p => p.value))];

            if (m.kind instanceof nodes.RecordType) {

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
    mapTo(m, (t, k) =>
        `${k} : ${isRecord(t) ? '{\n' + typeMap2TS(t) + '\n}' : t}`).join(',\n');

/**
 * parameter2TS 
 */
export const parameter2TS = (n: nodes.Parameter) => {

    if (n instanceof nodes.TypedParameter)
        return typedParameter2TS(n)
    else if (n instanceof nodes.UntypedParameter)
        return untypedParameter2TS(n)
    else
        return '';

}

/**
 * typedParameter2TS 
 */
export const typedParameter2TS = (n: nodes.TypedParameter) =>
    `${identifier2TS(n.id)}: ${type2TS(n.hint)} `;

/**
 * untypedParameter2TS 
 */
export const untypedParameter2TS = (n: nodes.UntypedParameter) =>
    `${identifier2TS(n.id)} `;

/**
 * children2TS
 */
export const children2TS = (ctx: Context, list: nodes.Child[]) =>
    `[${ctx.options.EOL}
        ${list.map(l => child2TS(ctx, l)).join(',' + ctx.options.EOL)}
     ]`;

/**
 * child2TS converts children to typescript.
 */
export const child2TS = (ctx: Context, n: nodes.Child): string => {

    if ((n instanceof nodes.Node) || (n instanceof nodes.Widget))
        return tag2TS(ctx, n);
    else if (n instanceof nodes.Interpolation)
        return interpolation2TS(ctx, n);
    else if (n instanceof nodes.IfStatement)
        return ifStatement2TS(ctx, n);
    else if (n instanceof nodes.ForInStatement)
        return forInStatement2TS(ctx, n);
    else if (n instanceof nodes.ForOfStatement)
        return forOfStatement2TS(ctx, n);
    else if (n instanceof nodes.Characters)
        return characters2TS(ctx, n);
    else if (n instanceof nodes.ContextProperty)
        return contextProperty2TS(n);
    else if (n instanceof nodes.QualifiedConstructor)
        return qualifiedConstructor2TS(n);
    else if (n instanceof nodes.UnqualifiedConstructor)
        return unqualifiedConstructor2TS(n);
    else if (n instanceof nodes.UnqualifiedIdentifier)
        return unqualifiedIdentifier2TS(n);
    else if (n instanceof nodes.QualifiedIdentifier)
        return qualifiedIdentifier2TS(n);
    else
        return '';

}

/**
 * tag2TS 
 */
export const tag2TS = (ctx: Context, n: nodes.Tag) => {

    if (n.type === 'widget') {

        return ctx.generator.widget(ctx, n);

    } else {

        return ctx.generator.node(ctx, n);

    }

}

/**
 * attribute2Value 
 */
export const attribute2TS = (ctx: Context, n: nodes.Attribute) =>
    `${attributeName2TS(ctx, n)} : ${attributeValue2TS(ctx, n)} `;

/**
 * attributeValue2TS
 */
export const attributeValue2TS =
    (ctx: Context, n: nodes.Attribute) =>
        (n.value instanceof nodes.Interpolation) ?
            interpolation2TS(ctx, n.value) :
            literal2TS(ctx, n.value);

/**
 * attributeName2TS
 */
export const attributeName2TS = (_: Context, n: nodes.Attribute) =>
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
export const groupAttrs = (ctx: Context, attrs: nodes.Attribute[])
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
export const interpolation2TS = (ctx: Context, n: nodes.Interpolation) =>
    n.filters.reduce((p, c) =>
        `${expression2TS(ctx, c)} (${p})`, expression2TS(ctx, n.expression));

/**
 * ifStatementTS
 */
export const ifStatement2TS = (ctx: Context, n: Ifs) =>
    ctx.generator.ifelse(ctx, n);

/**
 * forInStatement2TS
 */
export const forInStatement2TS = (ctx: Context, n: nodes.ForInStatement) =>
    ctx.generator.forIn(ctx, n);

/**
 * forOfStatement2TS
 */
export const forOfStatement2TS = (ctx: Context, n: nodes.ForStatement) =>
    ctx.generator.forOf(ctx, n);

/**
 * characters2TS converts character text to a typescript string.
 */
export const characters2TS = (ctx: Context, n: nodes.Characters) =>
    ctx.generator.text(ctx, n.value);

/**
 * expression2TS 
 */
export const expression2TS = (ctx: Context, n: nodes.Expression): string => {

    if (n instanceof nodes.IfThenExpression)
        return ifThenExpression2TS(ctx, n)
    else if (n instanceof nodes.BinaryExpression)
        return binaryExpression2TS(ctx, n)
    else if (n instanceof nodes.UnaryExpression)
        return unaryExpression2TS(ctx, n);
    else if (n instanceof nodes.ViewConstruction)
        return viewConstruction2TS(ctx, n);
    else if (n instanceof nodes.FunApplication)
        return funApplication2TS(ctx, n);
    else if (n instanceof nodes.ConstructExpression)
        return constructExpression2TS(ctx, n);
    else if (n instanceof nodes.CallExpression)
        return callExpression2TS(ctx, n);
    else if (n instanceof nodes.MemberExpression)
        return memberExpression2TS(ctx, n);
    else if (n instanceof nodes.FunctionExpression)
        return functionExpression2TS(ctx, n);
    else if (n instanceof nodes.Record)
        return record2TS(ctx, n)
    else if (n instanceof nodes.List)
        return list2TS(ctx, n)
    else if (n instanceof nodes.BooleanLiteral)
        return boolean2TS(n);
    else if (n instanceof nodes.NumberLiteral)
        return number2TS(n);
    else if (n instanceof nodes.StringLiteral)
        return string2TS(n);
    else if (n instanceof nodes.ContextProperty)
        return contextProperty2TS(n);
    else if (n instanceof nodes.QualifiedConstructor)
        return qualifiedConstructor2TS(n);
    else if (n instanceof nodes.UnqualifiedConstructor)
        return unqualifiedConstructor2TS(n);
    else if (n instanceof nodes.UnqualifiedIdentifier)
        return unqualifiedIdentifier2TS(n);
    else if (n instanceof nodes.QualifiedIdentifier)
        return qualifiedIdentifier2TS(n);
    else if (n instanceof nodes.ContextVariable)
        return contextVariable2TS(n);
    else
        return '';

}

/**
 * ifThenExpression2TS 
 */
export const ifThenExpression2TS = (ctx: Context, n: nodes.IfThenExpression) => {

    let condition = expression2TS(ctx, n.condition);
    let conseq = expression2TS(ctx, n.iftrue);
    let alt = expression2TS(ctx, n.iffalse);

    return `(${condition}) ? ${conseq} :  ${alt}`;

}

/**
 * binaryExpression2TS 
 */
export const binaryExpression2TS = (ctx: Context, n: nodes.BinaryExpression) => {

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
export const unaryExpression2TS = (ctx: Context, n: nodes.UnaryExpression) =>
    `${n.operator} (${expression2TS(ctx, n.expression)})`;

/**
 * viewConstruction2TS 
 */
export const viewConstruction2TS = (ctx: Context, n: nodes.ViewConstruction) =>
    `${THIS}.registerView((new ${constructor2TS(n.cons)}` +
    `(${expression2TS(ctx, n.context)}))).render()`;

/**
 * funApplication2TS 
 */
export const funApplication2TS = (ctx: Context, n: nodes.FunApplication) =>
    `${expression2TS(ctx, n.target)}${typeArgs2TS(n.typeArgs)} ` +
    `(${args2TS(ctx, n.args)})(${THIS})`;

/**
 * constructExpression2TS 
 */
export const constructExpression2TS =
    (ctx: Context, n: nodes.ConstructExpression) => {

        let cons = constructor2TS(n.cons);

        return ((casters.indexOf(cons) === -1) ?
            'new ' : '') + `${cons}(${args2TS(ctx, n.args)})`;

    }

/**
 * callExpression2TS 
 */
export const callExpression2TS = (ctx: Context, n: nodes.CallExpression) => {

    let target = expression2TS(ctx, n.target);
    let typeArgs = typeArgs2TS(n.typeArgs);
    let args = args2TS(ctx, n.args);

    return `${target}${typeArgs}(${args})`;

}

/**
 * typeArgs2TS 
 */
export const typeArgs2TS = (ns: nodes.Type[]) =>
    ns.length === 0 ? '' : `<${ns.map(type2TS).join(',')}>`;

/**
 * args2TS converts a list of arguments to a typescript argument tupple.
 */
export const args2TS = (ctx: Context, ns: nodes.Expression[]) =>
    (ns.length === 0) ? '' : ns.map(e => expression2TS(ctx, e)).join(',');

/**
 * memberExpression2TS 
 */
export const memberExpression2TS = (ctx: Context, n: nodes.MemberExpression) =>
    `${expression2TS(ctx, n.target)}.${identifier2TS(n.member)} `;

/**
 * functionExpression2TS
 */
export const functionExpression2TS =
    (ctx: Context, n: nodes.FunctionExpression) => {

        let params = n.parameters.map(parameter2TS).join(',');
        let body = expression2TS(ctx, n.body);

        return `(${params}) => ${body}`;

    }

/**
 * literal2TS 
 */
export const literal2TS = (ctx: Context, n: nodes.Literal) => {

    if (n instanceof nodes.BooleanLiteral)
        return boolean2TS(n);
    else if (n instanceof nodes.StringLiteral)
        return string2TS(n);
    else if (n instanceof nodes.NumberLiteral)
        return number2TS(n);
    else if (n instanceof nodes.Record)
        return record2TS(ctx, n);
    else if (n instanceof nodes.List)
        return list2TS(ctx, n);
    else
        return '';

}

/**
 * boolean2TS 
 */
export const boolean2TS = (n: nodes.BooleanLiteral) => `${n.value} `;

/**
 * string2TS
 */
export const string2TS = (n: nodes.StringLiteral) => `'${n.value}'`;

/**
 * number2TS 
 */
export const number2TS = (n: nodes.NumberLiteral) => `${parseFloat(n.value)}`;

/**
 * record2TS
 */
export const record2TS = (ctx: Context, n: nodes.Record) =>
    `{${ctx.options.EOL} 
      ${n.properties.map(p => property2TS(ctx, p)).join(',' + ctx.options.EOL)}
     }`;

/**
 * list2TS
 */
export const list2TS = (ctx: Context, n: nodes.List) => {

    let mems = n.members.map(e => expression2TS(ctx, e));

    return `[${ctx.options.EOL}
            ${mems.join(',' + ctx.options.EOL)}
            ]`;

}

/**
 * property2TS
 */
export const property2TS = (ctx: Context, n: nodes.Property) =>
    `'${key2TS(n.key)}' : ${expression2TS(ctx, n.value)}`;

/**
 * key2TS 
 */
export const key2TS = (n: nodes.StringLiteral | nodes.UnqualifiedIdentifier) =>
    (n instanceof nodes.StringLiteral) ? string2TS(n) : identifier2TS(n);

/**
 * contextProperty2TS 
 */
export const contextProperty2TS = (n: nodes.ContextProperty) =>
    `${CONTEXT}.${identifier2TS(n.member)}`;

/**
 * contextVariable2TS 
 */
export const contextVariable2TS = (_: nodes.ContextVariable) => `${CONTEXT}`;

/**
 * identifierOrConstructor2TS
 */
export const identifierOrConstructor2TS =
    (n: nodes.Identifier | nodes.Constructor) => {

        if ((n instanceof nodes.UnqualifiedIdentifier) ||
            (n instanceof nodes.QualifiedIdentifier))
            return identifier2TS(n);
        else if ((n instanceof nodes.UnqualifiedConstructor) ||
            (n instanceof nodes.QualifiedConstructor))
            return constructor2TS(n);
        else
            return '';

    }

/**
 * constructor2TS 
 */
export const constructor2TS = (n: nodes.Constructor) => {

    if (n instanceof nodes.QualifiedConstructor)
        return qualifiedConstructor2TS(n);
    else if (n instanceof nodes.UnqualifiedConstructor)
        return unqualifiedConstructor2TS(n);
    else
        return '';

}

/**
 * unqualifiedConstructor2TS 
 */
export const unqualifiedConstructor2TS = (n: nodes.UnqualifiedConstructor) =>
    `${n.value}`;

/**
 * qualifiedConstructor
 */
export const qualifiedConstructor2TS = (n: nodes.QualifiedConstructor) =>
    `${n.qualifier}.${n.member}`;

/**
 * identifier2TS
 */
export const identifier2TS = (n: nodes.Identifier) => {

    if (n instanceof nodes.QualifiedIdentifier)
        return qualifiedIdentifier2TS(n)
    else if (n instanceof nodes.UnqualifiedIdentifier)
        return unqualifiedIdentifier2TS(n)
    else
        return ''

}

/**
 * qualifiedIdentifier2TS 
 */
export const qualifiedIdentifier2TS = (n: nodes.QualifiedIdentifier) =>
    `${n.qualifier}.${n.member}`;

/**
 * unqualifiedIdentifier2TS 
 */
export const unqualifiedIdentifier2TS = (n: nodes.UnqualifiedIdentifier) =>
    `${n.value}`;
