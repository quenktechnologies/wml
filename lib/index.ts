import * as property from 'property-seek';
import {
  Maybe, 
  nothing,
  fromArray,
  fromNullable } from '@quenk/noni/lib/data/maybe';

/**
 * Maybe from afpl used here as an option type.
 *
 * Limit usage of this class to the monad map, chain and orElse for now.
 * It is subject to change.
 */
export type Maybe<A> = Maybe<A>;

/**
 * WMLElement can be DOM content or a user defined widget. 
 */
export type WMLElement
    = Content
    | Widget
    ;

/**
 * Content is what is actually intended to be rendered on a web page.
 */
export type Content
    = Node
    | Element
    | HTMLElement
    ;

/**
 * @private
 */
type Iterable<V> = V[] | object;

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

};

/**
 * Template is a function that given a View
 * will provide DOM content as well as performing 
 * the side-effects of adding ids etc.
 */
export interface Template {

    (view: View): Content

}

/**
 * ContentProvider is the type of the function fun statements return.
 */
export interface ContentProvider {

    (view: View): Content

}

/**
 * Component is an abstract Widget implementation
 * that can be used instead of manually implementing the whole interface.
 *
 */
export abstract class Component<A extends Attrs> implements Widget {

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

    constructor(public attrs: A, public children: Content[]) { }

    rendered(): void { }

    removed(): void { }

    render(): Content { return this.view.render(); }

};

/**
 * AttributeMap is a map of values suitable for attributes on
 * a DOM Node.
 */
export interface AttributeMap<A> {

    [key: string]: A

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

        id?: string,
        group?: string

    },
    html: AttributeMap<string | number | boolean | Function>

}

/**
 * Ids is a map of WMLElements that have been given an id.
 */
export interface Ids {

    [key: string]: WMLElement

}

/**
 * Groups is a map of elements groupped together by the `wml:group` attributes.
 */
export interface Groups {

    [key: string]: WMLElement[]

}

/**
 * @private
 */
export interface WidgetConstructor<A> {

    new(attributes: A, children: Content[]): Widget;

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
export const read = <A>(path: string, o: object, defaultValue?: A): A => {

    let ret = property.get<A, object>(path.split(':').join('.'), o);

    return (ret != null) ? ret : <A>defaultValue;

}

/**
 * @private
 */
const adopt = (child: Content, e: Node): void => {

    switch (typeof child) {
        case 'string':
        case 'number':
        case 'boolean':
            e.appendChild(document.createTextNode('' + child));
        case 'object':
            e.appendChild(<Node>child);
            break;
        default:
            throw new TypeError(`Can not adopt child ${child} of type ${typeof child}`);

    }

};

/**
 * @private
 */
export const box = (...content: Content[]): Content => {

    let frag = document.createDocumentFragment();
    content.forEach(c => frag.appendChild(c));
    return frag;

};

/**
 * @private
 */
export const domify = <A>(a: A): Content => {

    if (a instanceof Array) {
        return box.apply(null, a.map(domify));

    } else if (
        (typeof a === 'string') ||
        (typeof a === 'number') ||
        (typeof a === 'boolean')) {

        return text(a);

    } else if (a instanceof Node) {

        return a;

    } else if (a == null) {

        return document.createDocumentFragment();

    } else {

        throw new TypeError(`Can not use '${a}'(typeof ${typeof a}) as Content!`);

    }

};

/**
 * text creates a new TextNode.
 * @private
 */
export const text = (value: boolean | number | string): Text =>
    document.createTextNode('' + value);

/**
 * node is called to create a regular DOM node
 * @private
 */
export const node = <A>(
    tag: string,
    attributes: AttributeMap<A>,
    children: Content[],
    view: View): Node => {

    var e = document.createElement(tag);

    if (typeof attributes['html'] === 'object')
        Object.keys(attributes['html']).forEach(key => {

            let value = (<any>attributes['html'])[key];

            if (typeof value === 'function') {
                (<any>e)[key] = value;
            } else if (typeof value === 'string') {

                if (value !== '') //prevent setting things like disabled=''
                    e.setAttribute(key, value);

            } else if (typeof value === 'boolean') {

                e.setAttribute(key, `${value}`);

            }

        });

    children.forEach(c => adopt(c, e));

    let id = (<any>attributes['wml']).id;
    let group = (<Attrs><any>attributes).wml.group;

    if (id)
        view.registerById(id, e);

    if (group)
        view.registerByGroup(group, e);

    return e;

}

/**
 * widget creates and renders a new wml widget instance.
 * @param {function} Construtor
 * @param {object} attributes
 * @param {array<string|number|Widget>} children
 * @param {View} view
 * @private
 * @return {Widget}
 */
export const widget =
    <A>(
        Constructor: WidgetConstructor<A>,
        attributes: A,
        children: Content[],
        view: View): Content => {

        var childs: Content[] = [];
        var w;

        children.forEach(child => (child instanceof Array) ?
            childs.push.apply(childs, child) : childs.push(child));

        w = new Constructor(attributes, childs);

        let id = (<Attrs><any>attributes).wml.id;
        let group = (<Attrs><any>attributes).wml.group;

        if (id)
            view.registerById(id, w);

        if (group)
            view.registerByGroup(group, w);

        view.registerWidget(w);

        return w.render();

    }

/**
 * ifthen provides an if then expression
 * @private
 */
export const ifthen = <P>(predicate: P, positive: () => Content, negative: () => Content) =>
    (predicate) ? positive() : negative();

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
export const map = <V>(
    collection: Iterable<V>,
    cb: MapCallback<V>,
    cb2: () => Content): Content => {

    var frag = document.createDocumentFragment();

    if (collection instanceof Array) {

        if (collection.length > 0)
            collection.forEach((v, k, a) => frag.appendChild(cb(v, k, a)));
        else
            frag.appendChild(cb2());

    } else if (typeof collection === 'object') {

        var l = Object.keys(collection);

        if (l.length > 0)
            l.forEach(k => frag.appendChild(cb((<any>collection)[k], k, collection)));
        else
            frag.appendChild(cb2());

    }

    return frag;

}

/**
 * AppView is the concrete implementation of a View.
 *
 * @property {<C>} context - The context the view is rendered in.
 */
export class AppView<C> implements View {

    ids: { [key: string]: WMLElement } = {};

    groups: { [key: string]: WMLElement[] } = {};

    widgets: Widget[] = [];

    tree: Content = document.createElement('div');

    template: Template = () => document.createElement('div');

    _fragRoot: Node = document.createElement('div');

    constructor(public context: C) { }

    registerWidget(w: Widget): AppView<C> {

        this.widgets.push(w);

        return this;

    }

    registerById(id: string, w: WMLElement): AppView<C> {

        if (this.ids.hasOwnProperty(id))
            throw new Error(`Duplicate id '${id}' detected!`);

        this.ids[id] = w;

        return this;

    }

    registerByGroup(group: string, e: WMLElement): AppView<C> {

        this.groups[group] = this.groups[group] || [];
        this.groups[group].push(e);

        return this;

    }

    findById<A extends WMLElement>(id: string): Maybe<A> {

        return fromNullable<A>(<A>this.ids[id])
            .orElse(() => {
                console.warn(`The id '${id}' is missing!`);
                return nothing<A>();
            });

    }

    findGroupByName(name: string): Maybe<WMLElement[]> {

        return fromArray(this.groups.hasOwnProperty(name) ? this.groups[name] : []);

    }

    invalidate(): void {

        var childs;
        var realFirstChildIndex = -1;
        var tree = (this._fragRoot) ? this._fragRoot : this.tree;
        var parent = <Node>tree.parentNode;

        if (tree == null)
            return console.warn('invalidate(): Cannot invalidate a view that has not been rendered!');

        if (tree.parentNode == null)
            return console.warn('invalidate(): Attempt to invalidate a view that has not been inserted to DOM!');

        childs = (<Element>tree.parentNode).children;

        // for some reason tree occasionally ends up with a null parentNode
        // when we attempt to call replaceChild. Noticeably after doing work on an array.
        // We do this to use the index instead of passing the reference directly.
        for (let i = 0; i < childs.length; i++)
            if (childs[i] === tree)
                realFirstChildIndex = i;

        // just in case we never got the index.
        if (realFirstChildIndex === -1)
            throw new Error('invaldiate(): Cannot invalidate view, DOM tree appears to have no parent!');

        parent.replaceChild(this.render(), (<Element>parent).children[realFirstChildIndex]);

    }

    render(): Content {

        this.ids = {};
        this.widgets.forEach(w => w.removed());
        this.widgets = [];
        this._fragRoot = <any>null;
        this.tree = this.template(this);
        this.ids['root'] = (this.ids['root']) ? this.ids['root'] : this.tree;

        if (this.tree.nodeName === (document.createDocumentFragment()).nodeName)
            this._fragRoot = <Node>this.tree.firstChild;

        this.widgets.forEach(w => w.rendered());

        return this.tree;

    }

}
