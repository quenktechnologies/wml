import * as ast from '../parse/ast';

/**
 * rewriteViewContext turns the "where" clause of view statements into their
 * own context declaration. 
 *
 * A context declaration with id <view-name>Context will be generated and the
 * ViewStatement's context property updated.
 */
export const rewriteViewStatementContext =
    (node: ast.ViewStatement): ast.Export[] => {

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

        } else {

            return [node];

        }

    }

/**
 * transformTree applies all the needed transforms to the AST before 
 * compilation.
 */
export const transformTree = (tree: ast.Module) => new ast.Module(
  tree.imports,
    tree.exports.reduce((prev, curr) => (curr instanceof ast.ViewStatement) ?
        [...prev, ...rewriteViewStatementContext(curr)] :
        [...prev, curr], <ast.Export[]>[]),
  tree.location
);
