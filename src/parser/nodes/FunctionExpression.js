import Node from './Node';

var count = 0;
/**
 * FunctionExpression
 * @param {array<string>} parameters
 * @param {Expression} expression
 * @param {Location} location
 */
class FunctionExpression extends Node {

    constructor(parameters, expression, location) {

        super();
        this.type = 'function-expression';
        this.parameters = parameters;
        this.expression = expression;
        this.location = location;

    }

    transpile(o) {

        var params = this.parameters.map(p => p.transpile(o)).join(',');
        count = count + 1;

        return `function function_literal_${count}(${params})` +
            `{ return ${this.expression.transpile(o)}; }.bind(this)`;

    }

    compile(o) {

        var node = this.sourceNode(o.fileName, '');

        node.add(`function function_literal_${count}(${this.parameters.join(',')})`).
        add('{ return ');

        return this.compileList(this.body.compile(o)).
        add('; } bind(this)');

    }

}

export default FunctionExpression
