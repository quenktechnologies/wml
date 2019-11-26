import * as ast from '../../../parse/ast';

import { Generator } from '../../code/generator';
import { Context } from '../../code';
import {
    CONTEXT,
    WML,
    THIS,
    children2TS,
    groupAttrs,
    attrs2String,
    constructor2TS,
    identifier2TS,
    expression2TS,
    parameter2TS,
    typeParameters,
    unqualifiedIdentifier2TS,
    type2TS,
    tag2TS,
    ifStatement2TS,
    eol
} from './output';

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
 * DOMGenerator targets the client side DOM.
 */
export class DOMGenerator implements Generator {

    imports(ctx: Context) {

        return [
            `//@ts-ignore: 6192`,
            `import {`,
            `Maybe as ${MAYBE},`,
            `fromNullable as ${FROM_NULLABLE},`,
            `fromArray as ${FROM_ARRAY}`,
            `}`,
            `from '@quenk/noni/lib/data/maybe';`
        ].join(eol(ctx));

    }

    definitions(ctx: Context) {

        return [
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

    }

    view(ctx: Context, n: ast.ViewStatement) {

        let id = n.id ? constructor2TS(n.id) : 'Main';

        let typeParams = typeParameters(n.typeParameters);

        let c = type2TS(n.context);

        let template = tag2TS(ctx, n.root);

        return [

            `export class ${id} ${typeParams} implements ${WML}.View {`,
            ``,
            `   constructor(${CONTEXT}: ${c}) {`,
            ``,
            `       this.template = (${THIS}:${WML}.Registry) => {`,
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
            `   tree: ${WML}.Content = document.createElement('div');`,
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
            `   register(${REGISTER_PARAMS}) {`,
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
            `   node(${NODE_PARAMS}) {`,
            ``,
            `       let e = document.createElement(tag);`,
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
            `             e.setAttribute(key, \`\${value}\`);`,
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
            `                     let tn = document.createTextNode(''+c);`,
            `                     e.appendChild(tn)`,
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
            `   widget(${WIDGET_PARAMS}) {`,
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
            `       parent.replaceChild(this.render(), tree) `,
            ``,
            `   }`,
            ``,
            `   render(): ${WML}.Content {`,
            ``,
            `       this.ids = {};`,
            `       this.widgets.forEach(w => w.removed());`,
            `       this.widgets = [];`,
            `       this.views = [];`,
            `       this.tree = this.template(this);`,
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

    fun(ctx: Context, n: ast.FunStatement) {

        let id = unqualifiedIdentifier2TS(n.id);

        let typeParams = typeParameters(n.typeParameters);

        let params = (n.parameters.length === 0) ? '' :
            n.parameters.map(parameter2TS).join(',');

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

    widget(ctx: Context, w: ast.Widget) {

        let name = constructor2TS(w.open);
        let attrs = attrs2String(groupAttrs(ctx, w.attributes));
        let childs = children2TS(ctx, w.children);

        return `${THIS}.widget(new ${name}(${attrs}, ${childs}),` +
            `<${WML}.Attrs>${attrs})`;

    }

    node(ctx: Context, n: ast.Node) {

        let name = identifier2TS(n.open);
        let attrs = attrs2String(groupAttrs(ctx, n.attributes));
        let childs = children2TS(ctx, n.children);

        return `${THIS}.node('${name}', <${WML}.Attrs>${attrs}, ${childs})`;

    }

    ifelse(ctx: Context, n: ast.IfStatement) {

        let condition = expression2TS(ctx, n.condition);
        let conseq = children2TS(ctx, n.then);

        let alt = (n.elseClause instanceof ast.ElseIfClause) ?
            `[${ifStatement2TS(ctx, n.elseClause)}]` :
            (n.elseClause instanceof ast.ElseClause) ?
                children2TS(ctx, n.elseClause.children) :
                '[]';

        return [
            `...(${IF}(${condition},`,
            `   ()=> (${conseq}),`,
            `   ()=> (${alt}))) `,
        ].join(ctx.options.EOL);

    }

    forIn(ctx: Context, n: ast.ForInStatement) {

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

    forOf(ctx: Context, n: ast.ForOfStatement) {

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

    text(_: Context, str: string) {

        return `document.createTextNode(\`${str}\`)`;

    }

}
