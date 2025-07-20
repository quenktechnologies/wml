import * as dom from "./dom";

import { Maybe } from "@quenk/noni/lib/data/maybe";
import { Record } from "@quenk/noni/lib/data/record";
import { Type } from "@quenk/noni/lib/data/type";

export { Maybe };

/**
 * WidgetConstructor
 */
export type WidgetConstructor<A extends Attrs> = new (
  attributes: A,
  children: Content[],
) => Widget;

/**
 * WMLElement can be DOM content or a user defined widget.
 */
export type WMLElement = Content | Widget;

/**
 * Content is what is actually intended to be rendered on a web page.
 */
export type Content = Node | Element | HTMLElement;

/**
 * HTMLAttributeValue
 */
export type HTMLAttributeValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Function;

/**
 * Template is a function that given a View (Registry)
 * will provide DOM content as well as performing
 * the side-effects of adding ids etc.
 */
export type Template = (r: Registry) => Content;

/**
 * Fun corresponds to the compiled signature of fun statements.
 */
export type Fun = (r: Registry) => Content[];

/**
 * Registry keeps track of the WMLElements in a view.
 */
export interface Registry {
  /**
   * registerView
   */
  registerView(v: View): View;

  /**
   * register an element.
   */
  register<A extends Attrs>(e: WMLElement, attrs: A): WMLElement;

  /**
   * node registers a Node.
   */
  node(tag: string, attrs: Attrs, children: Content[]): Content;

  /**
   * widget registers a Widget.
   */
  widget(w: Widget, attrs: Attrs): Content;
}

/**
 * Renderable is an interface implemented by objects in a WML tree that can
 * produce [[Content]] objects.
 *
 * This interface exists separate from the View interface for use in places
 * where only the render() method is desired.
 */
export interface Renderable {
  render(): Content;
}

/**
 * View instances are compiled from wml template files.
 *
 * They provide an api for rendering user interfaces and
 * querying individual objects(WMLElement) it is made of.
 */
export interface View extends Renderable {
  /**
   * invalidate this View causing the DOM to be re-rendered.
   *
   * Re-rendering is done by finding the parentNode of the root
   * of the View's Content and replacing it with a new version.
   * If the view has not yet been added to the DOM, this will fail.
   */
  invalidate(): void;

  /**
   * findById retrives a WMLElement that has been assigned a `wml:id`
   * attribute matching id.
   */
  findById<E extends WMLElement>(id: string): Maybe<E>;

  /**
   * findGroupById retrives an array of WMLElements that have a `wml:group`
   * attribute matching name.
   */
  findGroupById<E extends WMLElement>(name: string): E[];
}

export class BaseView implements View {
  constructor(
    public context: object,
    public template: (reg: Registry) => WMLElement,
  ) {}

  ids: Record<WMLElement> = {};

  groups: Record<WMLElement[]> = {};

  views: View[] = [];

  widgets: Widget[] = [];

  tree: Node = dom.createElement("div");

  registerView(view: View): View {
    this.views.push(view);

    return view;
  }

  register(e: WMLElement, attrs: Attributes<Type>): WMLElement {
    let attrsMap = <Attrs>(<Type>attrs);

    if (attrsMap.wml) {
      let { id, group } = attrsMap.wml;

      if (id != null) {
        if (this.ids.hasOwnProperty(id))
          throw new Error(`Duplicate id '${id}' detected!`);

        this.ids[id] = e;
      }

      if (group != null) {
        this.groups[group] = this.groups[group] || [];
        this.groups[group].push(e);
      }
    }
    return e;
  }

  node(tag: string, attrs: Attrs, children: Content[]): Content {
    let asDOMAttrs = <dom.WMLDOMAttrs>(<object>attrs);

    let e = dom.createElement(
      tag,
      asDOMAttrs,
      children,
      (attrs.wml && attrs.wml.ns) || "",
    );

    this.register(e, attrs);

    return e;
  }

  widget(w: Widget, attrs: Attrs): Content {
    this.register(w, attrs);

    this.widgets.push(w);

    return w.render();
  }

  findById<E extends WMLElement>(id: string): Maybe<E> {
    let mW: Maybe<E> = Maybe.fromNullable<E>(<E>this.ids[id]);

    return this.views.reduce((p, c) => (p.isJust() ? p : c.findById(id)), mW);
  }

  findGroupById<E extends WMLElement>(name: string): E[] {
    return this.groups.hasOwnProperty(name) ? <E[]>this.groups[name] : [];
  }

  invalidate(): void {
    let { tree } = this;
    let parent = <Node>tree.parentNode;

    if (tree == null)
      return console.warn("invalidate(): " + "Missing DOM tree!");

    if (tree.parentNode == null)
      throw new Error(
        "invalidate(): cannot invalidate this view, it has no parent node!",
      );

    parent.replaceChild(<Node>this.render(), tree);
  }

  render(): Content {
    this.ids = {};
    this.widgets.forEach((w) => w.removed());
    this.widgets = [];
    this.views = [];
    this.tree = <Node>this.template(this);

    this.ids["root"] = this.ids["root"] ? this.ids["root"] : this.tree;

    this.widgets.forEach((w) => w.rendered());

    return this.tree;
  }
}

/**
 * Widget is the user land api of custom Renderable objects
 * that provide desired functionality.
 *
 * It has two lifecycle methods that are recognized by View.
 */
export interface Widget extends Renderable {
  /**
   * rendered is called after the Widget has been added to a DOM tree.
   */
  rendered(): void;

  /**
   * removed is only called after the View has been invalidated.
   *
   * That means it is NOT called if the Widget is removed from the DOM
   * in some other way.
   */
  removed(): void;
}

/**
 * ContentProvider is the type of the function fun statements return.
 */
export interface ContentProvider {
  (view: View): Content;
}

/**
 * Component is an abstract Widget implementation
 * that can be used instead of manually implementing the whole interface.
 */
export abstract class Component<A extends Attrs> implements Widget {
  /**
   * view for this Component.
   *
   * The render method by default returns the render result of this View.
   */
  abstract view: View;

  /**
   * @param {A} attrs is the attributes this Component excepts.
   * @param {Content[]} children is an array of content for Component.
   */
  constructor(
    public attrs: A,
    public children: Content[],
  ) {}

  rendered(): void {}

  removed(): void {}

  render(): Content {
    return this.view.render();
  }
}

/**
 * Attributes is a map of values suitable for attributes on
 * a DOM Node.
 */
export interface Attributes<V> {
  [key: string]: V;
}

/**
 * Attrs is an interface describing the minimum attributes
 * a Widget can have.
 *
 * Extend this interface when creating custom Widgets so attributes
 * can be passed in a type safe way.
 */
export interface Attrs {
  wml?: {
    id?: string;

    group?: string;

    ns?: string;
  };
}

/**
 * Ids is a map of WMLElements that have been given an id.
 */
export interface Ids {
  [key: string]: WMLElement;
}

/**
 * Groups is a map of elements groupped together by the `wml:group` attributes.
 */
export interface Groups {
  [key: string]: WMLElement[];
}

/**
 * renderAsNode content from a Renderable.
 *
 * This function unsafely assumes the Renderable always returns DOM content.
 */
export const renderAsNode = (r: Renderable): Node => <Node>r.render();
