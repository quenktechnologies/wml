import * as ast from "../parse/ast";
import { identifierOrConstructor2TS } from "./codegen";

/**
 * rewriteViewContext normalizes the various forms of the context declaration
 * in a view statement.
 *
 * "where" clauses are turned into context declarations with id
 * <view-type>Context, imports are included in the module's import list.
 */
export const rewriteViewStatementContext = (
  tree: ast.Module,
  node: ast.ViewStatement,
): ast.Export[] => {
  if (Array.isArray(node.context)) {
    // TODO: Is this branch still needed?

    let contextName = `${node.id.value}Context`;

    let context = new ast.ContextStatement(
      new ast.UnqualifiedIdentifier(contextName, node.id.location),
      node.typeParameters,
      node.context,
      node.location,
    );

    let consType = new ast.ConstructorType(
      context.id,
      context.typeParameters,
      context.location,
    );

    let view = new ast.ViewStatement(
      node.id,
      node.typeParameters,
      consType,
      node.directives,
      node.root,
      node.location,
    );

    return [context, view];
  } else if (node.context instanceof ast.ContextFromStatement) {
    let { context } = node;

    let { location } = context;

    tree.imports.push(
      new ast.ImportStatement(
        new ast.CompositeMember(
          [<ast.UnqualifiedConstructor>context.cons.id],
          location,
        ),
        context.module,
        location,
      ),
    );

    return [
      new ast.ViewStatement(
        node.id,
        node.typeParameters,
        context.cons,
        node.directives,
        node.root,
        node.location,
      ),
    ];
  } else {
    return [node];
  }
};

export const TAG_NAME_SVG = "svg";

/**
 * tagSVGNodes traverses the tree to detect any embedded svg.
 *
 * If an svg parent tag is found, it and all its children will receive a
 * wml:ns=svg attribute. This will cause the runtime to use createElementNS()
 * instead of createElement, allowing the svg document to be treated as SVG
 * and not HTML DOM.
 */
export const tagSVGNodes = (tag: ast.Tag) => {
  let pending: [boolean, object[]][] = [[false, [tag]]];

  while (pending.length) {
    let [isSvg, stack] = <[boolean, object[]]>pending.pop();

    while (stack.length) {
      let next = stack.pop();

      if (
        next instanceof ast.Node &&
        identifierOrConstructor2TS(next.open) === TAG_NAME_SVG &&
        !isSvg
      ) {
        pending.push([true, [next]]);
        break;
      }

      let childrens = [];
      if (next instanceof ast.Node) {
        if (isSvg)
          next.attributes.push(
            new ast.Attribute(
              new ast.UnqualifiedIdentifier("wml", {}),
              new ast.UnqualifiedIdentifier("ns", {}),
              new ast.StringLiteral("svg", {}),
              {},
            ),
          );

        childrens.push(next.children);
      } else if (next instanceof ast.Widget || next instanceof ast.ElseClause) {
        childrens.push(next.children);
      } else if (next instanceof ast.ForOfStatement) {
        childrens.push(next.body, next.otherwise);
      } else if (
        next instanceof ast.IfStatement ||
        next instanceof ast.ElseIfClause
      ) {
        childrens.push(next.then);
        if (next.elseClause) childrens.push([next.elseClause]);
      }

      for (let children of childrens)
        for (let child of children) stack.push(child);
    }
  }

  return tag;
};

/**
 * transformTree applies all the needed transforms to the AST before
 * compilation.
 */
export const transformTree = (tree: ast.Module) => {
  let newTree = tree.clone(); // Try not to modify what we don't own.

  newTree.exports = tree.exports.reduce(
    (prev, next) => {
      if (next instanceof ast.ViewStatement) {
        next.root = tagSVGNodes(next.root);

        return [...prev, ...rewriteViewStatementContext(newTree, next)];
      } else {
        return [...prev, next];
      }
    },
    <ast.Export[]>[],
  );

  return newTree;
};
