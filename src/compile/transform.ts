import * as ast from '../parse/ast';

/**
 * rewriteViewContext normalizes the various forms of the context declaration
 * in a view statement.
 *
 * WHERE clauses are turned into context declarations with id <view-type>Context,
 * imports are included in the module's import list.
 */
export const rewriteViewStatementContext =
    (tree: ast.Module, node: ast.ViewStatement): ast.Export[] => {

        if (Array.isArray(node.context)) {

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

        } else if (node.context instanceof ast.ImportStatement) {
            console.error(node);
            tree.imports.push(node.context);

            let cons = (<ast.UnqualifiedConstructor>                node.context.member);

            let ctx = new ast.ConstructorType(cons, [], node.location);

            return [
                new ast.ViewStatement(
                    node.id,
                    node.typeParameters,
                    ctx,
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
 * transformTree applies all the needed transforms to the AST before 
 * compilation.
 */
export const transformTree = (tree: ast.Module) => {

    let newTree = tree.clone(); // Try not to modify what we don't own.

    newTree.exports = tree.exports.reduce((prev, curr) =>
        (curr instanceof ast.ViewStatement) ?
            [...prev, ...rewriteViewStatementContext(newTree, curr)] :
            [...prev, curr], <ast.Export[]>[]);

    return newTree;

}
