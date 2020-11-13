export default class ConditionalInterpreter {
  tokens: Token[];

  static WHITESPACE = /\s/;

  static STRING = /[^)!=&|]/;

  constructor(public readonly input: string) {
    this.tokens = ConditionalInterpreter.tokenize(input);
  }

  parse() {
    const ast = new ProgramNode();
    let current = 0;
    const walk = (): Node => {
      const token = this.tokens[current];
      switch (token.type) {
        case TokenType.Paren: {
          const expressionNode = new ExpressionNode();
          current++;
          const left = walk();
          if (
            left.type !== NodeType.String &&
            left.type !== NodeType.Expression
          ) {
            throw new Error(
              `${left.type} is not a valid left of an expression`
            );
          }
          expressionNode.left = left;
          const operator = walk() as OperatorNode;
          if (operator.type !== NodeType.Operator || !operator.value) {
            throw new Error(
              `${operator.type} ${operator.value} is not a valid operator`
            );
          }
          expressionNode.operator = operator;
          const right = walk();
          if (
            right.type !== NodeType.String &&
            right.type !== NodeType.Expression
          ) {
            throw new Error(
              `${right.type} is not a valid right of an expression`
            );
          }
          expressionNode.right = right;
        }
        case TokenType.String: {
          current++;
          return new StringNode(token.value);
        }
        case TokenType.Operator: {
        }
      }
      current++;
      throw new Error(`unknown token ${token.type}`);
    };
    while (current < this.tokens.length) {
      ast.body.push(walk());
    }
    return ast;
  }

  static tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    const inputArray = [...input];
    let current = 0;
    while (current < inputArray.length) {
      let char = inputArray[current];
      if (typeof char === 'undefined') break;
      switch (char) {
        case '(': {
          current++;
          tokens.push(new Token(TokenType.Paren, '('));
          continue;
        }
        case ')': {
          current++;
          tokens.push(new Token(TokenType.Paren, ')'));
          continue;
        }
        case '=': {
          current++;
          tokens.push(new Token(TokenType.Operator, '='));
          continue;
        }
        case '!': {
          if (inputArray[current + 1] === '=') {
            char = inputArray[++current];
            current++;
            tokens.push(new Token(TokenType.Operator, '!='));
            continue;
          }
        }
        case '&': {
          if (inputArray[current + 1] === '&') {
            char = inputArray[++current];
            current++;
            tokens.push(new Token(TokenType.Operator, '&&'));
            continue;
          }
        }
        case '|': {
          if (inputArray[current + 1] === '|') {
            char = inputArray[++current];
            current++;
            tokens.push(new Token(TokenType.Operator, '||'));
            continue;
          }
        }
      }
      let value = '';
      while (
        typeof char !== 'undefined' &&
        ConditionalInterpreter.STRING.test(char)
      ) {
        value += char;
        char = inputArray[++current];
      }
      if (value.length) tokens.push(new Token(TokenType.String, value));
      continue;
    }
    return tokens;
  }
}

export class Token {
  value: string;

  constructor(public readonly type: TokenType, value: string) {
    this.value = value;
  }
}

export enum TokenType {
  Operator = 'OPERATOR',
  Paren = 'PAREN',
  String = 'STRING'
}

export enum NodeType {
  Expression = 'CALL_EXPRESSION',
  Operator = 'OPERATOR',
  Program = 'PROGRAM',
  String = 'STRING'
}

export abstract class Node {
  abstract readonly type: NodeType;
}

export class ExpressionNode extends Node {
  readonly type = NodeType.Expression;

  left?: Node;

  operator?: OperatorNode;

  right?: Node;
}

export class OperatorNode extends Node {
  readonly type = NodeType.Operator;

  value?: string;
}

export class StringNode extends Node {
  readonly type = NodeType.String;

  constructor(public readonly value: string) {
    super();
  }
}

export class ProgramNode extends Node {
  readonly type = NodeType.Program;

  body: Node[] = [];
}
