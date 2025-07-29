import * as dom from "../dom";

import { Maybe } from "@quenk/noni/lib/data/maybe";

import { DOMMonitor } from "../dom/monitor";
import { Attrs, Content, WMLId, Widget } from "..";
import { View } from ".";

export interface Entry {
  node: Content;
  widget?: Widget;
}

/**
 * ViewFrame serves as a container for a View's rendered template.
 *
 * This class containers helper methods for retreiving elements by id or
 * group freeing the View class of such logic.
 */
export class ViewFrame {
  constructor(
    public ids: Map<WMLId, Entry> = new Map(),
    public groups: Map<WMLId, Entry[]> = new Map(),
    public tree?: Content,
  ) {}

  _register(id: WMLId, node: Content, widget?: Widget) {
    // throw if in use?
    let entry = this.ids.get(id) ?? { node };
    entry.widget = widget;
    this.ids.set(id, entry);
  }

  _registerGroupMember(id: WMLId, node: Content, widget?: Widget) {
    // throw if in use?
    let group = this.groups.get(id) ?? [];
    group.push({ node, widget });
    this.groups.set(id, group);
  }

  /**
   * root sets the root element of a View's tree.
   */
  root(el: Content) {
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

    if (attrs?.wml?.id) this._register(attrs.wml.id, elm);

    if (attrs?.wml?.group) this._registerGroupMember(attrs.wml.group, elm);

    return elm;
  }

  /**
   * widget constructs a DOM sub-tree for a Widget in the View's tree.
   *
   * Any id or group assignment will be honored.
   */
  widget(w: Widget, attrs: Attrs): Content {
    let tree = w.render();

    DOMMonitor.getInstance().monitor(tree, w);

    if (attrs?.wml?.id) this._register(attrs.wml.id, tree, w);

    if (attrs?.wml?.group) this._registerGroupMember(attrs.wml.group, tree, w);

    return tree;
  }

  /**
   * view renders the content of another view, saving its ids and groups to
   * this one.
   */
  view(view: View): Content {
    let { root } = this;
    let tree = view.render(this);
    this.root = root;
    return tree;
  }

  /**
   * findById returns the entry stored for the specified wml element.
   */
  findById(id: WMLId): Maybe<Entry> {
    return Maybe.fromNullable(this.ids.get(id));
  }

  /**
   * findGroupByid returns all the entries stored fro a group.
   */
  findGroupBy(id: WMLId): Entry[] {
    return this.groups.get(id) ?? [];
  }

  _redraw(entry: Entry) {
    if (!entry.node.parentNode) return;

    let currentNode = entry.node;

    entry.node = entry.widget ? entry.widget.render() : currentNode;

    (<Node>entry.node.parentNode).replaceChild(entry.node, currentNode);
  }

  /**
   * redraw re-renders an id'd widget so that the latest version of its
   * DOM is shown in the UI.
   *
   * For id'd HTML DOM nodes, this is a effectively a noop.
   */
  redraw(id: WMLId) {
    let entry = this.ids.get(id);

    if (entry) this._redraw(entry);
  }

  /**
   * redrawGroup is like redraw() but for groups.
   */
  redrawGroup(id: WMLId) {
    for (let entry of this.groups.get(id) ?? []) {
      this._redraw(entry);
      if (!entry.node.parentNode) continue;
    }
  }
}
