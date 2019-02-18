"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
/**
 * Component is an abstract Widget implementation
 * that can be used instead of manually implementing the whole interface.
 */
var Component = /** @class */ (function () {
    /**
     * @param {A} attrs is the attributes this Component excepts.
     * @param {Content[]} children is an array of content for Component.
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
//# sourceMappingURL=index.js.map