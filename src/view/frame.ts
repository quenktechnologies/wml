import * as dom from '../dom';

import { Maybe } from '@quenk/noni/lib/data/maybe';

import { Attrs, Content, WMLElement, Widget } from "..";

export type Id = string;

export interface Entry {
  node?: Node 
  widget?: Widget
}

/**
 * ViewFrame serves as a container for a View's rendered template.
 *
 * This class containers helper methods for retreiving elements by id or 
 * group freeing the View class of such logic.
 */
export class ViewFrame {
  constructor(
    public ids: Map<Id, Entry> = new Map(),
    public groups: Map<Id, WMLElement[]> = new Map(),
    public children: ViewFrame[] = [],
    public tree?: Node

  ) {}

  _register(id:Id, tree:Node, widget?: Widget) {
    // throw if in use?
    let entry = this.ids.get(id) ?? {}
    entry.node = tree;
    entry.widget = widget;
    this.ids.set(id, entry);
  }

  _registerGroupMember(id:Id, member:WMLElement) {
    // throw if in use?
    let group = this.groups.get(id) ?? [];
    group.push(member);
    this.groups.set(id, group);
  }

  /**
   * root sets the root element of a View's tree.
   */
  root(el: Node) {
    this.tree = el;
  }

  /**
   * node constructs a DOM node to be used in the View's tree.
   *
   * Any id or group assignment will be honored.
   */
  node(tag: string, attrs: Attrs, children: Content[]): Content {
    let elm = dom.createElement(
      tag,
      <dom.WMLDOMAttrs>attrs,
      children,
      (attrs.wml && attrs.wml.ns) || "",
    );

    if(attrs?.wml?.id) 
      this._register(attrs.wml.id, elm);
    

    if(attrs?.wml?.group)
      this._registerGroupMember(attrs.wml.group, elm);

    return elm;
  }

  /**
   * widget constructs a DOM sub-tree for a Widget in the View's tree.
   * 
   * Any id or group assignment will be honored.
   */
  widget(w: Widget, attrs: Attrs): Content {
    let tree = w.render();

    if(attrs?.wml?.id)
      this._register(attrs.wml.id, tree, w);

    if(attrs?.wml?.group)
      this._registerGroupMember(attrs.wml.group, w);

    return  tree;
  }

  /**
   * findById returns the entry stored for the specified wml element.
   */
  findById(id: string): Maybe<Entry> {
    return Maybe.fromNullable(this.ids.get(id));
  }

  /**
   * findGroupByid returns a group of elements matching the specified group id.
   */
  findGroupBy(id:Id) : WMLElement[] {
    return this.groups.get(id) ?? [];
  }
}

