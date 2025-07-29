import { DOMEventCallbacks } from "./dom/monitor";
import { View, BaseView } from "./view";

export { Maybe } from '@quenk/noni/lib/data/maybe';
export { ViewFrame } from "./view/frame";
export { View, BaseView };

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
 * WMLId is a string used to identify a WML element or group within  a view.
 */
export type WMLId = string;

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
 * Widget is the user land api of custom Renderable objects
 * that provide desired functionality.
 *
 * It has two lifecycle methods that are recognized by View.
 */
export interface Widget extends Renderable, DOMEventCallbacks {
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
