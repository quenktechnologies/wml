"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderAsNode = exports.Component = void 0;
/**
 * Component is an abstract Widget implementation
 * that can be used instead of manually implementing the whole interface.
 */
class Component {
    /**
     * @param {A} attrs is the attributes this Component excepts.
     * @param {Content[]} children is an array of content for Component.
     */
    constructor(attrs, children) {
        this.attrs = attrs;
        this.children = children;
    }
    rendered() { }
    removed() { }
    render() { return this.view.render(); }
}
exports.Component = Component;
;
/**
 * renderAsNode content from a Renderable.
 *
 * This function unsafely assumes the Renderable always returns DOM content.
 */
const renderAsNode = (r) => r.render();
exports.renderAsNode = renderAsNode;
//# sourceMappingURL=index.js.map