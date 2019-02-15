import {    Maybe} from '@quenk/noni/lib/data/maybe';

/**
 * Maybe type.
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
 * Template is a function that given a View
 * will provide DOM content as well as performing 
 * the side-effects of adding ids etc.
 */
export type Template = (r: Registry) => Content;

/**
 * Registry keeps track of the WMLElements in a view.
 */
export interface Registry {

    /**
     * register an element.
     */
    register<A>(e: WMLElement, attrs: AttributeMap<A>): WMLElement;

    /**
     * node registers a Node.
     */
    node<A>(tag: string, attrs: AttributeMap<A>, children: Content[]): WMLElement

    /**
     * widget registers a Widget.
     */
    widget<A>(c: WidgetConstructor<A>,
        attrs: AttributeMap<A>, children: Content): WMLElement


}

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
     * findByGroup retrives an array of WMLElements that have a `wml:group`
     * attribute matching name.
     *
     * Returns a Maybe type from the afpl library.
     */
    findByGroup(name: string): Maybe<WMLElement[]>;

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

};


/**
 * ContentProvider is the type of the function fun statements return.
 */
export interface ContentProvider {

    (view: View): Content

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
 * WidgetConstructor
 */
export interface WidgetConstructor<A> {

    new(attributes: A, children: Content[]): Widget;

}
