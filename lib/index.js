"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var property = require("property-seek");
var Maybe_1 = require("afpl/lib/monad/Maybe");
var Compiler_1 = require("./Compiler");
exports.parse = Compiler_1.parse;
exports.compile = Compiler_1.compile;
;
/**
 * Component is an abstract Widget implementation
 * that can be used instead of manually implementing the whole interface.
 *
 */
var Component = /** @class */ (function () {
    /**
     * attrs is the attributes this Component excepts.
     */
    /**
     * children is an array of content passed to this Component.
     */
    function Component(attrs, children) {
        this.attrs = attrs;
        this.children = children;
    }
    Component.prototype.rendered = function () { };
    Component.prototype.removed = function () { };
    Component.prototype.render = function () { return this.view.render(); };
    return Component;
}());
exports.Component = Component;
;
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
exports.read = function (path, o, defaultValue) {
    var ret = property.get(path.split(':').join('.'), o);
    return (ret != null) ? ret : defaultValue;
};
/**
 * @private
 */
var adopt = function (child, e) {
    switch (typeof child) {
        case 'string':
        case 'number':
        case 'boolean':
            e.appendChild(document.createTextNode('' + child));
        case 'object':
            e.appendChild(child);
            break;
        default:
            throw new TypeError("Can not adopt child " + child + " of type " + typeof child);
    }
};
/**
 * @private
 */
exports.box = function () {
    var content = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        content[_i] = arguments[_i];
    }
    var frag = document.createDocumentFragment();
    content.forEach(function (c) { return frag.appendChild(c); });
    return frag;
};
/**
 * @private
 */
exports.domify = function (a) {
    if (a instanceof Array) {
        return exports.box.apply(null, a.map(exports.domify));
    }
    else if ((typeof a === 'string') ||
        (typeof a === 'number') ||
        (typeof a === 'boolean')) {
        return exports.text(a);
    }
    else if (a instanceof Node) {
        return a;
    }
    else if (a == null) {
        return document.createDocumentFragment();
    }
    else {
        throw new TypeError("Can not use '" + a + "'(typeof " + typeof a + ") as Content!");
    }
};
/**
 * text creates a new TextNode.
 * @private
 */
exports.text = function (value) {
    return document.createTextNode('' + value);
};
/**
 * node is called to create a regular DOM node
 * @private
 */
exports.node = function (tag, attributes, children, view) {
    var e = document.createElement(tag);
    if (typeof attributes['html'] === 'object')
        Object.keys(attributes['html']).forEach(function (key) {
            var value = attributes['html'][key];
            if (typeof value === 'function') {
                e[key] = value;
            }
            else if (typeof value === 'string') {
                if (value !== '')
                    e.setAttribute(key, value);
            }
            else if (typeof value === 'boolean') {
                e.setAttribute(key, "" + value);
            }
        });
    children.forEach(function (c) { return adopt(c, e); });
    var id = attributes['wml'].id;
    var group = attributes.wml.group;
    if (id)
        view.registerById(id, e);
    if (group)
        view.registerByGroup(group, e);
    return e;
};
/**
 * widget creates and renders a new wml widget instance.
 * @param {function} Construtor
 * @param {object} attributes
 * @param {array<string|number|Widget>} children
 * @param {View} view
 * @private
 * @return {Widget}
 */
exports.widget = function (Constructor, attributes, children, view) {
    var childs = [];
    var w;
    children.forEach(function (child) { return (child instanceof Array) ?
        childs.push.apply(childs, child) : childs.push(child); });
    w = new Constructor(attributes, childs);
    var id = attributes.wml.id;
    var group = attributes.wml.group;
    if (id)
        view.registerById(id, w);
    if (group)
        view.registerByGroup(group, w);
    view.registerWidget(w);
    return w.render();
};
/**
 * ifthen provides an if then expression
 * @private
 */
exports.ifthen = function (predicate, positive, negative) {
    return (predicate) ? positive() : negative();
};
/**
 * forE provides a for expression
 * @private
 */
exports.map = function (collection, cb, cb2) {
    var frag = document.createDocumentFragment();
    if (collection instanceof Array) {
        if (collection.length > 0)
            collection.forEach(function (v, k, a) { return frag.appendChild(cb(v, k, a)); });
        else
            frag.appendChild(cb2());
    }
    else if (typeof collection === 'object') {
        var l = Object.keys(collection);
        if (l.length > 0)
            l.forEach(function (k) { return frag.appendChild(cb(collection[k], k, collection)); });
        else
            frag.appendChild(cb2());
    }
    return frag;
};
/**
 * AppView is the concrete implementation of a View.
 *
 * @property {<C>} context - The context the view is rendered in.
 */
var AppView = /** @class */ (function () {
    function AppView(context) {
        this.context = context;
        this.ids = {};
        this.groups = {};
        this.widgets = [];
    }
    AppView.prototype.registerWidget = function (w) {
        this.widgets.push(w);
        return this;
    };
    AppView.prototype.registerById = function (id, w) {
        if (this.ids.hasOwnProperty(id))
            throw new Error("Duplicate id '" + id + "' detected!");
        this.ids[id] = w;
        return this;
    };
    AppView.prototype.registerByGroup = function (group, e) {
        this.groups[group] = this.groups[group] || [];
        this.groups[group].push(e);
        return this;
    };
    AppView.prototype.findById = function (id) {
        return Maybe_1.Maybe
            .fromAny(this.ids[id])
            .orElse(function () {
            console.warn("The id '" + id + "' is missing!");
            return Maybe_1.Maybe.nothing();
        });
    };
    AppView.prototype.findGroupByName = function (name) {
        return Maybe_1.Maybe.fromArray(this.groups.hasOwnProperty(name) ? this.groups[name] : []);
    };
    AppView.prototype.invalidate = function () {
        var childs;
        var realFirstChildIndex = -1;
        var tree = (this._fragRoot) ? this._fragRoot : this.tree;
        var parent = tree.parentNode;
        if (tree == null)
            throw new ReferenceError('invalidate(): Cannot invalidate a view that has not been rendered!');
        if (tree.parentNode == null)
            throw new ReferenceError('invalidate(): Attempt to invalidate a view that has not been inserted to DOM!');
        childs = tree.parentNode.children;
        // for some reason tree occasionally ends up with a null parentNode
        // when we attempt to call replaceChild. Noticeably after doing work on an array.
        // We do this to use the index instead of passing the reference directly.
        for (var i = 0; i < childs.length; i++)
            if (childs[i] === tree)
                realFirstChildIndex = i;
        // just in case we never got the index.
        if (realFirstChildIndex === -1)
            throw new Error('invaldiate(): Cannot invalidate view, DOM tree appears to have no parent!');
        parent.replaceChild(this.render(), parent.children[realFirstChildIndex]);
    };
    AppView.prototype.render = function () {
        this.ids = {};
        this.widgets.forEach(function (w) { return w.removed(); });
        this.widgets = [];
        this._fragRoot = null;
        this.tree = this.template(this);
        this.ids['root'] = (this.ids['root']) ? this.ids['root'] : this.tree;
        if (this.tree.nodeName === (document.createDocumentFragment()).nodeName)
            this._fragRoot = this.tree.firstChild;
        this.widgets.forEach(function (w) { return w.rendered(); });
        return this.tree;
    };
    return AppView;
}());
exports.AppView = AppView;
//# sourceMappingURL=index.js.map