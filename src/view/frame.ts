import * as dom from "../dom";

import { Maybe } from "@quenk/noni/lib/data/maybe";

import { DOMMonitor } from "../dom/monitor";
import { Attrs, Content, WMLId, Widget } from "..";
import { View } from ".";

/**
 * Index used for lists and other data structures.
 *
 * TODO: migrate to noni.
 */
export type Index = number;

/**
 * Entry contains the DOM node and optional widget for an WMLElement.
 */
export interface Entry {
  node: Content;
  widget?: Widget;
}

/**
 * SetList is a list like data structure that ensures an object is only added
 * once.
 *
 * This allows for items to be added and their index returned without having
 * to iterate over the members to determine if the item was added already.
 *
 * Instead a map of item -> index values is kept internally allowing for fast
 * lookup of new items being added.
 *
 * TODO:
 * 1. Migrate to noni.
 * 2. Find a way to support nested objects, example: {node, widget}
 */
class SetList {
  constructor(
    public items: Content[] = [],
    public cache: Map<Content, Index> = new Map(),
  ) {}

  add(item: Content) {
    let idx = this.cache.get(item) ?? this.items.push(item) - 1;
    this.cache.set(item, idx);
    return idx;
  }

  set(id: Index, item: Content) {
    let prev = this.items[id];
    this.items[id] = item;
    this.cache.delete(prev);
    this.cache.set(item, id);
    return id;
  }

  has(id: Index) {
    return Boolean(this.get(id));
  }

  get(id: Index) {
    return this.items[id];
  }

  delete(idx: Index) {
    let node = this.items[idx];
    this.items.splice(idx, 1);
    this.cache.delete(node);
  }
}

/**
 * Frame serves as a container for the DOM elements a View's template
 * renders.
 *
 * Each time the render() method is called a new Frame is created and passed
 * to the rendering logic so that a DOM tree is built along with accesible
 * wml ids and groups.
 */
export interface Frame {
  /**
   * root sets the root element of a View's tree.
   */
  root(el: Content): void;

  /**
   * node constructs a DOM node to be used in the View's tree.
   *
   * Any id or group assignment will be honored.
   */
  node(tag: string, attrs: Attrs, children: Content[]): Content;

  /**
   * widget constructs a DOM sub-tree for a Widget in the View's tree.
   *
   * Any id or group assignment will be honored.
   */
  widget(w: Widget, attrs: Attrs): Content;

  /**
   * view renders the content of another view, saving its ids and groups to
   * this one.
   */
  view(view: View): Content;
}

/**
 * MultiFrame is a composite that allows more than one Frame to be rendered
 * at the same time.
 */
export class MultiFrame implements Frame {
  constructor(public frames: Frame[] = []) {}

  root(el: Content) {
    for (let f of this.frames) {
      f.root(el);
    }
  }

  node(tag: string, attrs: Attrs, children: Content[]): Content {
    let results = this.frames.map((f) => f.node(tag, attrs, children));
    return results[0] ?? dom.createElement("div", {}, []);
  }

  widget(w: Widget, attrs: Attrs): Content {
    let results = this.frames.map((f) => f.widget(w, attrs));
    return results[0] ?? dom.createElement("div", {}, []);
  }

  view(view: View): Content {
    let results = this.frames.map((f) => f.view(view));
    return results[0] ?? dom.createElement("div", {}, []);
  }
}

/**
 * ViewFrame contains helper methods for retreiving elements by id or
 * group freeing the View class of such logic.
 */
export class ViewFrame implements Frame {
  constructor(
    public nodes = new SetList(),
    public widgets = new Map<Index, Widget>(),
    public groups: Map<WMLId, Index[]> = new Map(),
    public ids = new Map<WMLId, Index>(),
    public indexes = new Map<Index, WMLId>(),
    public tree?: Content,
  ) {}

  _register(id: WMLId, node: Content, widget?: Widget) {
    let idx = this.nodes.add(node);
    this.ids.set(id, idx);
    this.indexes.set(idx, id);
    if (widget) {
      this.widgets.set(idx, widget);
    }
  }

  _registerGroupMember(id: WMLId, node: Content, widget?: Widget) {
    let group = this.groups.get(id) ?? [];
    let idx = this.nodes.add(node);
    group.push(idx);

    if (widget) this.widgets.set(idx, widget);

    this.groups.set(id, group);
  }

  root(el: Content) {
    this.tree = el;
  }

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

  widget(w: Widget, attrs: Attrs): Content {
    let tree = w.render();

    DOMMonitor.getInstance().monitor(tree, w);

    if (attrs?.wml?.id) this._register(attrs.wml.id, tree, w);

    if (attrs?.wml?.group) this._registerGroupMember(attrs.wml.group, tree, w);

    return tree;
  }

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
    let idx = this.ids.get(id) ?? -1;
    let node = this.nodes.get(idx);
    if (node == null) return Maybe.nothing();
    return Maybe.just({
      node,
      widget: this.widgets.get(idx),
    });
  }

  /**
   * findByGroup returns all the entries stored fro a group.
   */
  findByGroup(id: WMLId): Entry[] {
    let result = [];
    for (let idx of this.groups.get(id) ?? []) {
      let node = this.nodes.get(idx);
      let widget = this.widgets.get(idx);
      if (node == null) continue;
      result.push({ node, widget });
    }
    return result;
  }

  /**
   * replaceByIndex performs the heavy work of replacing a WMLElement
   * with the corresponding index from another ViewFrame.
   *
   * The replaced element will have its DOM content redrawn if a parentNode
   * is detected.
   */
  replaceByIndex(next: ViewFrame, idx: Index) {
    let originalNode = this.nodes.get(idx);
    let id = this.indexes.get(idx) ?? "";

    if (idx == null || originalNode == null) {
      console.warn(`Not replacing missing WMLElement for id "${id}"!`);
      return;
    }

    let { parentNode } = originalNode;

    let node = next.nodes.get(idx);
    let widget = next.widgets.get(idx);
    if (node == null) {
      // Remove references since the node no longer exists.
      this.nodes.delete(idx);
      this.widgets.delete(idx);
      this.ids.delete(id);
      this.indexes.delete(idx);
      if (parentNode) parentNode.removeChild(originalNode);
      return;
    }

    this.nodes.set(idx, node);
    this.widgets.delete(idx);

    if (widget) this.widgets.set(idx, widget);

    if (parentNode) parentNode.replaceChild(node, originalNode);
  }

  /**
   * replaceById allows WMLElement replacement by using an id.
   */
  replaceById(next: ViewFrame, id: WMLId) {
    this.replaceByIndex(next, this.ids.get(id) ?? -1);
  }

  /**
   * replaceByGroup allows WMLElement replaced by using a group identifier.
   */
  replaceByGroup(next: ViewFrame, id: WMLId) {
    let group = this.groups.get(id) ?? [];

    let newGroup = [];
    for (let idx of group) {
      this.replaceByIndex(next, idx);
      if (this.nodes.has(idx)) newGroup.push(idx);
    }

    this.groups.set(id, newGroup);
  }
}
