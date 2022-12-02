import * as ast from '../parse/ast';

/**
 * rewriteViewContext normalizes the various forms of the context declaration
 * in a view statement.
 *
 * "where" clauses are turned into context declarations with id 
 * <view-type>Context, imports are included in the module's import list.
 */
export const rewriteViewStatementContext =
    (tree: ast.Module, node: ast.ViewStatement): ast.Export[] => {

        if (Array.isArray(node.context)) {

            // TODO: Is this branch still needed?

            let contextName = `${node.id.value}Context`;

            let context = new ast.ContextStatement(
                new ast.UnqualifiedIdentifier(contextName, node.id.location),
                node.typeParameters,
                node.context,
                node.location
            );

            let consType = new ast.ConstructorType(
                context.id,
                context.typeParameters,
                context.location
            );

            let view = new ast.ViewStatement(
                node.id,
                node.typeParameters,
                consType,
                node.directives,
                node.root,
                node.location
            );

            return [context, view];

        } else if (node.context instanceof ast.ContextFromStatement) {

            let { context } = node;

            let { location } = context;

            tree.imports.push(new ast.ImportStatement(
                new ast.CompositeMember([
                    <ast.UnqualifiedConstructor>context.cons.id], location),
                context.module,
                location
            ));

            return [
                new ast.ViewStatement(
                    node.id,
                    node.typeParameters,
                    context.cons,
                    node.directives,
                    node.root,
                    node.location
                )
            ];

        } else {

            return [node];

        }

    }

/**
 * tagXMLNamespaces detects the "xmlns" attribute on DOM nodes and copies them
 * to the `wml:ns` attribute recursively.
 *
 * This has the effect of ensuring nodes are created using createElementNS()
 * instead of createElement in the browser.
 */
export const tagXMLNamespaces =
    (tag: ast.Tag | ast.Widget, parentAttr?: ast.Attribute) => {

        let attr = (tag.attributes.find(attr =>
            (attr.namespace.value = '') && (attr.name.value === 'xmlns'))) ||
            parentAttr;

        if (attr) {

            tag.attributes.push(new ast.Attribute(
                new ast.UnqualifiedIdentifier('wml', attr.location),
                new ast.UnqualifiedIdentifier('ns', attr.location),
                attr.value,
                attr.location
            ));

        }

        tag.children.forEach(child => {

            if ((child instanceof ast.Node) || (child instanceof ast.Widget))
                tagXMLNamespaces(child, attr);

        });

        return tag;

    }

/**
 * transformTree applies all the needed transforms to the AST before 
 * compilation.
 */
export const transformTree = (tree: ast.Module) => {

    let newTree = tree.clone(); // Try not to modify what we don't own.

    newTree.exports = tree.exports.reduce((prev, next) => {
    
      if (next instanceof ast.ViewStatement)  {

        next.root = tagXMLNamespaces(next.root);
            
        return [...prev, ...rewriteViewStatementContext(newTree, next)] 

      } else {

            return [...prev, next]

      }}, <ast.Export[]>[]);

    return newTree;

}
