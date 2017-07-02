import Node from './Node';
import preamble from '../preamble';
import {
  js_beautify
} from 'js-beautify';


/**
 * Template
 * @param {array<Import>} imports
 * @param {array<string>} uses
 * @param {Tag} root
 * @param {Location} location
 */
class Template extends Node {

  constructor(imports, uses, exports, root, location) {

    super();

    this.type = 'template';
    this.imports = imports;
    this.uses = uses;
    this.exports = exports;
    this.root = root;
    this.location = location;

  }

  transpile() {

    var str = '';
    var args = this.uses.map(p => p.transpile()).join(',');

    args = (args) ? ' ,' + args : args;

    let imports = this.imports.map(i => i.transpile());
    let exports = this.exports.map(e => e.transpile());

    return `${imports} \n ${preamble()} \n ${exports}
    export class Main {

       constructor(context) {

          let view = this;

          this.ids = {};
          this.widgets = [];

          this.tree = null;
          this.context = context;
          this.template = function(){return ${this.root.transpile()}};

       }

       static render(context) {

         return (new Main(context)).render();

       }

       findById(id) {

        return (this.ids[id]) ? this.ids[id] : null;

       }

       render() {

        var tree = null;

        this.ids = {};
        this.widgets.forEach(w => w.removed());
        this.widgets = [];

        tree = this.template.call(this.context);
        this.ids.root = (this.ids.root)? this.ids.root:tree;
        this.widgets.forEach(w => w.rendered());

        return tree;

      }

     }

     export default Main;

    `;

  }

  compile(o) {

    var str = '';
    var args = this.uses.map(p => p.compile(o));

    args = (args) ? ' ,' + args : args;

    var sn = this.sourceNode(o.fileName, '').
    add(this.imports.map(i => i.compile(o))).
    add(`\n`).
    add(this.exports.map(e => e.compile(o))).
    add(`\n`).
    add(`export`).
    add(` { `);

    this.exports.forEach(e => sn.add(`${e.id}`).add(`,`));

    return sn.add(`}`).
    add(`;`).
    add(`\n`).
    add('export default function (make').
    add(args).
    add('{ return ').
    add(this.root.compile(o)).
    add('; }');


  }

}

export default Template

