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
  abstract type: NodeType;
}

export class ExpressionNode extends Node {
  type = NodeType.Expression;

  constructor(
    public left: Node,
    public operator: OperatorNode,
    public right: Node
  ) {
    super();
  }
}

export class OperatorNode extends Node {
  type = NodeType.Operator;
}

export class StringNode extends Node {
  type = NodeType.String;
}

export class ProgramNode extends Node {
  type = NodeType.Program;

  body: Node[] = [];
}
