"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ast = require("../../../parse/ast");
var output_1 = require("./output");
var MAYBE = '__Maybe';
var FROM_NULLABLE = '__fromNullable';
var FROM_ARRAY = '__fromArray';
var NODE_PARAMS = "tag:string, attrs:" + output_1.WML + ".Attributes<any>, " +
    ("children: " + output_1.WML + ".Content[]");
var WIDGET_PARAMS = "C: W, attrs:A, children: " + output_1.WML + ".Content[]";
var REGISTER_PARAMS = "e:" + output_1.WML + ".WMLElement, " +
    ("attrs:" + output_1.WML + ".Attributes<any>");
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
/**
 * DOMGenerator targets the client side DOM.
 */
var DOMGenerator = /** @class */ (function () {
    function DOMGenerator() {
    }
    DOMGenerator.prototype.imports = function (ctx) {
        return [
            "//@ts-ignore: 6192",
            "import {",
            "Maybe as " + MAYBE + ",",
            "fromNullable as " + FROM_NULLABLE + ",",
            "fromArray as " + FROM_ARRAY,
            "}",
            "from '@quenk/noni/lib/data/maybe';"
        ].join(output_1.eol(ctx));
    };
    DOMGenerator.prototype.definitions = function (ctx) {
        return [
            "" + IGNORE_UNUSED,
            "type " + IFARG + " = ()=>" + output_1.WML + ".Content[]",
            "",
            "" + IGNORE_UNUSED,
            "type " + FOR_ALT_TYPE + " = ()=> " + output_1.WML + ".Content[]",
            "",
            "" + IGNORE_UNUSED,
            "type " + FOR_IN_BODY + " =(val:A, idx:number, all:A[])=>" +
                (output_1.WML + ".Content[]"),
            "",
            "" + IGNORE_UNUSED,
            "type " + FOR_OF_BODY + " = (val:A, key:string, all:object) =>" +
                (output_1.WML + ".Content[]"),
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
            "(__expr) ? __conseq() :  alt ? __alt() : [];",
            "",
            "" + IGNORE_UNUSED,
            "const " + FOR_IN + " = <A>(list:A[], f:" + FOR_IN_BODY + ", alt:" +
                (FOR_ALT_TYPE + ") : " + output_1.WML + ".Content[] => {"),
            "",
            "   let ret:" + output_1.WML + ".Content[] = [];",
            "",
            "   for(let i=0; i<list.length; i++)",
            "       ret = ret.concat(f(list[i], i, list));",
            "",
            "   return ret.length === 0 ? alt() : ret;",
            "",
            "}",
            "" + IGNORE_UNUSED,
            "const " + FOR_OF + " = <A>(o:" + RECORD + ", f:" + FOR_OF_BODY + "," +
                ("alt:" + FOR_ALT_TYPE + ") : " + output_1.WML + ".Content[] => {"),
            "",
            "    let ret:" + output_1.WML + ".Content[] = [];",
            "",
            "    for(let key in o)",
            "  \t    if(o.hasOwnProperty(key)) ",
            "\t        ret = ret.concat(f((o)[key], key, o));",
            "",
            "    return ret.length === 0 ? alt(): ret;",
            "",
            "}"
        ].join(output_1.eol(ctx));
    };
    DOMGenerator.prototype.view = function (ctx, n) {
        var id = n.id ? output_1.constructor2TS(n.id) : 'Main';
        var typeParams = output_1.typeParameters(n.typeParameters);
        var c = output_1.type2TS(n.context);
        var template = output_1.tag2TS(ctx, n.root);
        return [
            "export class " + id + " " + typeParams + " implements " + output_1.WML + ".View {",
            "",
            "   constructor(" + output_1.CONTEXT + ": " + c + ") {",
            "",
            "       this.template = (" + output_1.THIS + ":" + output_1.WML + ".Registry) => {",
            "",
            "           return " + template + ";",
            "",
            "       }",
            "",
            "   }",
            "",
            "   ids: { [key: string]: " + output_1.WML + ".WMLElement } = {};",
            "",
            "   groups: { [key: string]: " + output_1.WML + ".WMLElement[] } = {};",
            "",
            "   widgets: " + output_1.WML + ".Widget[] = [];",
            "",
            "   tree: " + output_1.WML + ".Content = document.createElement('div');",
            "",
            "   template: " + output_1.WML + ".Template;",
            "",
            "   register(" + REGISTER_PARAMS + ") {",
            "",
            "       let id = (<" + output_1.WML + ".Attrs><any>attrs).wml.id;",
            "       let group = <string>(<" + output_1.WML + ".Attrs><any>attrs).wml.group;",
            "",
            "       if(id != null) {",
            "",
            "           if (this.ids.hasOwnProperty(id))",
            "             throw new Error(`Duplicate id '${id}' detected!`);",
            "",
            "           this.ids[id] = e;",
            "",
            "       }",
            "",
            "       if(group != null) {",
            "",
            "           this.groups[group] = this.groups[group] || [];",
            "           this.groups[group].push(e);",
            "",
            "       }",
            "",
            "       return e;",
            "}",
            "",
            "   node(" + NODE_PARAMS + ") {",
            "",
            "       let e = document.createElement(tag);",
            "",
            "       if (typeof attrs['html'] === 'object')",
            "",
            "       Object.keys(attrs['html']).forEach(key => {",
            "",
            "           let value = (<any>attrs['html'])[key];",
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
            "             e.setAttribute(key, `${value}`);",
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
            "                     let tn = document.createTextNode(''+c);",
            "                     e.appendChild(tn)",
            "                   case 'object':",
            "                       e.appendChild(<Node>c);",
            "                   break;",
            "                   default:",
            "                       " + THROW_CHILD_ERR,
            "",
            "               }})",
            "",
            "",
            "       this.register(e, attrs);",
            "",
            "       return e;",
            "",
            "   }",
            "",
            "",
            "   widget<A extends " + output_1.WML + ".Attrs, W extends " + output_1.WML + ".",
            "   WidgetConstructor<A>>(" + WIDGET_PARAMS + ") {",
            "",
            "       let w = new C(attrs, children);",
            "",
            "       this.register(w, attrs);",
            "",
            "       this.widgets.push(w);",
            "",
            "       return w.render();",
            "",
            "   }",
            "",
            "   findById<E extends " + output_1.WML + ".WMLElement>(id: string): " + MAYBE + "<E> {",
            "",
            "       return " + FROM_NULLABLE + "<E>(<E>this.ids[id])",
            "",
            "   }",
            "",
            "   findByGroup<E extends " + output_1.WML + ".WMLElement>(name: string): " +
                (MAYBE + "<E[]> {"),
            "",
            "       return " + FROM_ARRAY + "(this.groups.hasOwnProperty(name) ?",
            "           <any>this.groups[name] : ",
            "           []);",
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
            "       parent.replaceChild(this.render(), tree) ",
            "",
            "   }",
            "",
            "   render(): " + output_1.WML + ".Content {",
            "",
            "       this.ids = {};",
            "       this.widgets.forEach(w => w.removed());",
            "       this.widgets = [];",
            "       this.tree = this.template(this);",
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
        ].join(output_1.eol(ctx));
    };
    DOMGenerator.prototype.fun = function (ctx, n) {
        var id = output_1.unqualifiedIdentifier2TS(n.id);
        var typeParams = output_1.typeParameters(n.typeParameters);
        var params = (n.parameters.length === 0) ? '() =>' :
            n.parameters.map(output_1.parameter2TS).join(',');
        var factory = "(" + output_1.THIS + ":" + output_1.WML + ".Registry) : " + output_1.WML + ".Content[] =>";
        var body = output_1.children2TS(ctx, n.body);
        return [
            "export const " + id + " = ",
            "",
            typeParams + "(" + params + ")" + factory + " {",
            "",
            "   return " + body + ";",
            "",
            "};"
        ].join(output_1.eol(ctx));
    };
    DOMGenerator.prototype.widget = function (ctx, w) {
        var name = output_1.constructor2TS(w.open);
        var attrs = output_1.attrs2String(output_1.groupAttrs(ctx, w.attributes));
        var childs = output_1.children2TS(ctx, w.children);
        return output_1.THIS + ".widget(" + name + ", " + attrs + ", " + childs + ")";
    };
    DOMGenerator.prototype.node = function (ctx, n) {
        var name = output_1.identifier2TS(n.open);
        var attrs = output_1.attrs2String(output_1.groupAttrs(ctx, n.attributes));
        var childs = output_1.children2TS(ctx, n.children);
        return output_1.THIS + ".node('" + name + "', " + attrs + ", " + childs + ")";
    };
    DOMGenerator.prototype.ifelse = function (ctx, n) {
        var condition = output_1.expression2TS(ctx, n.condition);
        var conseq = output_1.children2TS(ctx, n.then);
        var alt = (n.elseClause instanceof ast.ElseIfClause) ?
            "[" + output_1.ifStatement2TS(ctx, n.elseClause) + "]" :
            (n.elseClause instanceof ast.ElseClause) ?
                output_1.children2TS(ctx, n.elseClause.children) :
                '[]';
        return [
            "...(" + IF + "(" + condition + ",",
            "   ()=> (" + conseq + "),",
            "   ()=> (" + alt + "))) ",
        ].join(ctx.options.EOL);
    };
    DOMGenerator.prototype.forIn = function (ctx, n) {
        var expr = output_1.expression2TS(ctx, n.expression);
        var value = output_1.parameter2TS(n.variables[0]);
        var key = n.variables.length > 1 ? output_1.parameter2TS(n.variables[1]) : '_$$i';
        var all = n.variables.length > 2 ? output_1.parameter2TS(n.variables[2]) : '_$$all';
        var body = output_1.children2TS(ctx, n.body);
        var alt = n.otherwise.length > 0 ? output_1.children2TS(ctx, n.otherwise) : '[]';
        return [
            "..." + FOR_IN + " (" + expr + ", (" + value + ", " + key + ", " + all + ")=> ",
            "(" + body + "), ",
            "()=> (" + alt + "))"
        ].join(ctx.options.EOL);
    };
    DOMGenerator.prototype.forOf = function (ctx, n) {
        var expr = output_1.expression2TS(ctx, n.expression);
        var value = output_1.parameter2TS(n.variables[0]);
        var key = n.variables.length > 1 ? output_1.parameter2TS(n.variables[1]) : '_$$k';
        var all = n.variables.length > 2 ? output_1.parameter2TS(n.variables[2]) : '_$$all';
        var body = output_1.children2TS(ctx, n.body);
        var alt = n.otherwise.length > 0 ? output_1.children2TS(ctx, n.otherwise) : '[]';
        return [
            "..." + FOR_OF + " (" + expr + ", (" + value + ", " + key + ", " + all + ") => ",
            "       (" + body + "), ",
            "    ()=> (" + alt + "))"
        ].join(output_1.eol(ctx));
    };
    DOMGenerator.prototype.text = function (_, str) {
        return "document.createTextNode(`" + str + "`)";
    };
    return DOMGenerator;
}());
exports.DOMGenerator = DOMGenerator;
//# sourceMappingURL=generator.js.map