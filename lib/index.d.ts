import { Maybe } from '@quenk/noni/lib/data/maybe';
/**
 * Maybe from afpl used here as an option type.
 *
 * Limit usage of this class to the monad map, chain and orElse for now.
 * It is subject to change.
 */
export declare type Maybe<A> = Maybe<A>;
/**
 * WMLElement can be DOM content or a user defined widget.
 */
export declare type WMLElement = Content | Widget;
/**
 * Content is what is actually intended to be rendered on a web page.
 */
export declare type Content = Node | Element | HTMLElement;
/**
 * @private
 */
declare type Iterable<V> = V[] | object;
/**
 * Renderable is an interface for providing Content.
 *
 * When AppView#render is called, it calls the render
 * method of this interface for each widget it encounters.
 *
 * This interface can be used in places where we want to
 * accept something that can be rendered but don't want
 * all the additional baggage of a view.
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
     *
     * Returns a Maybe type from the afpl library.
     */
    findById<A extends WMLElement>(id: string): Maybe<A>;
    /**
     * findGroupByName retrives an array of WMLElements that have a `wml:group`
     * attribute matching name.
     *
     * Returns a Maybe type from the afpl library.
     */
    findGroupByName(name: string): Maybe<WMLElement[]>;
    /**
     * registerWidget registers a widget with the view.
     *
     * This widget will be notified during lifecycle event.
     */
    registerWidget(w: Widget): View;
    /**
     * registerById a WMLElement with this View.
     */
    registerById(id: string, w: WMLElement): View;
    /**
     * registerByGroup a WMLELement with this View.
     */
    registerByGroup(group: string, e: WMLElement): View;
}
/**
 *
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
 * Template is a function that given a View
 * will provide DOM content as well as performing
 * the side-effects of adding ids etc.
 */
export interface Template {
    (view: View): Content;
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
 *
 */
export declare abstract class Component<A extends Attrs> implements Widget {
    attrs: A;
    children: Content[];
    /**
     * view for this Component.
     *
     * The render method by default returns the render result of this View.
     */
    abstract view: View;
    /**
     * attrs is the attributes this Component excepts.
     */
    /**
     * children is an array of content passed to this Component.
     */
    constructor(attrs: A, children: Content[]);
    rendered(): void;
    removed(): void;
    render(): Content;
}
/**
 * AttributeMap is a map of values suitable for attributes on
 * a DOM Node.
 */
export interface AttributeMap<A> {
    [key: string]: A;
}
/**
 * Attrs is an interface describing the minimum attributes
 * a Widget can have.
 *
 * Extend this interface when creating custom Widgets so attributes
 * can be passed in a type safe way.
 */
export interface Attrs {
    wml: {
        id?: string;
        group?: string;
    };
    html: AttributeMap<string | number | boolean | Function>;
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
 * @private
 */
export interface WidgetConstructor<A> {
    new (attributes: A, children: Content[]): Widget;
}
/**
 * read a value form an object.
 *
 * This is an alternative to regular property access that will throw exceptions
 * if any of the values in the part are null.
 * @param {string} path - The path to look up on the object.
 * @param {object} o - The object
 * @param {A} [defaultValue] - This value is returned if the value is not set.
 * @private
 */
export declare const read: <A>(path: string, o: object, defaultValue?: A | undefined) => A;
/**
 * @private
 */
export declare const box: (...content: Content[]) => Content;
/**
 * @private
 */
export declare const domify: <A>(a: A) => Content;
/**
 * text creates a new TextNode.
 * @private
 */
export declare const text: (value: string | number | boolean) => Text;
/**
 * node is called to create a regular DOM node
 * @private
 */
export declare const node: <A>(tag: string, attributes: AttributeMap<A>, children: Content[], view: View) => Node;
/**
 * widget creates and renders a new wml widget instance.
 * @param {function} Construtor
 * @param {object} attributes
 * @param {array<string|number|Widget>} children
 * @param {View} view
 * @private
 * @return {Widget}
 */
export declare const widget: <A>(Constructor: WidgetConstructor<A>, attributes: A, children: Content[], view: View) => Content;
/**
 * ifthen provides an if then expression
 * @private
 */
export declare const ifthen: <P>(predicate: P, positive: () => Content, negative: () => Content) => Node;
/**
 * @private
 */
export interface MapCallback<V> {
    (value: V, index?: string | number, source?: V[] | object): Content;
}
/**
 * forE provides a for expression
 * @private
 */
export declare const map: <V>(collection: Iterable<V>, cb: MapCallback<V>, cb2: () => Content) => Content;
/**
 * AppView is the concrete implementation of a View.
 *
 * @property {<C>} context - The context the view is rendered in.
 */
export declare class AppView<C> implements View {
    context: C;
    ids: {
        [key: string]: WMLElement;
    };
    groups: {
        [key: string]: WMLElement[];
    };
    widgets: Widget[];
    tree: Content;
    template: Template;
    _fragRoot: Node;
    constructor(context: C);
    registerWidget(w: Widget): AppView<C>;
    registerById(id: string, w: WMLElement): AppView<C>;
    registerByGroup(group: string, e: WMLElement): AppView<C>;
    findById<A extends WMLElement>(id: string): Maybe<A>;
    findGroupByName(name: string): Maybe<WMLElement[]>;
    invalidate(): void;
    render(): Content;
}
export {};
