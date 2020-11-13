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
    const state: ParseState = { newExpression: false };
    const walk = (): Node | undefined => {
      let token = this.tokens[current];
      if (state.newExpression) {
        throw new Error('starting new expression without parens');
      }
      const getExpressionNode = (): Node | undefined => {
        const expressionNode = new ExpressionNode();
        const left = walk();
        if (
          left?.type !== NodeType.String &&
          left?.type !== NodeType.Expression
        ) {
          throw new Error(
            `${left?.type} ${left?.value} is not a valid left of an expression`
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
          right?.type !== NodeType.String &&
          right?.type !== NodeType.Expression
        ) {
          throw new Error(
            `${right?.type} ${right?.value} is not a valid right of an expression`
          );
        }
        expressionNode.right = right;
        return expressionNode;
      };
      switch (token.type) {
        case TokenType.Paren: {
          if (token.value === '(') {
            token = this.tokens[++current];
            const expressionNode = getExpressionNode();
            token = this.tokens[++current];
            if (token.type !== TokenType.Paren && token.value !== ')') {
              throw new Error('expression must close');
            }
            return expressionNode;
          }
          const nextToken = this.tokens[current + 1];
          if (nextToken?.type === TokenType.String) {
            state.newExpression = true;
          }
          ++current;
          break;
        }
        case TokenType.String: {
          current++;
          return new StringNode(token.value);
        }
        case TokenType.Operator: {
          const operatorNode = new OperatorNode(token.value);
          const nextToken = this.tokens[current + 1];
          if (
            token.value === '&&' ||
            (token.value === '||' && nextToken?.type === TokenType.String)
          ) {
            state.newExpression = true;
          }
          current++;
          return operatorNode;
        }
      }
    };
    while (current < this.tokens.length) {
      const node = walk();
      if (node) ast.body.push(node);
    }
    return ast;
  }

  static tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    const inputArray = [...input];
    let current = 0;
    const next = (times = 1): [string, string] => {
      current += times;
      return [inputArray[current], inputArray[current + 1]];
    };
    while (current < inputArray.length) {
      let [char, peek] = next(0);
      if (typeof char === 'undefined') break;
      switch (char) {
        case '(': {
          next();
          tokens.push(new Token(TokenType.Paren, Paren.Open));
          continue;
        }
        case ')': {
          next();
          tokens.push(new Token(TokenType.Paren, Paren.Close));
          continue;
        }
        case '=': {
          next();
          tokens.push(new Token(TokenType.Operator, Operator.Equal));
          continue;
        }
        case '!': {
          if (peek === '=') {
            next(2);
            tokens.push(new Token(TokenType.Operator, Operator.NotEqual));
            continue;
          }
        }
        case '&': {
          if (peek === '&') {
            next(2);
            tokens.push(new Token(TokenType.Operator, Operator.And));
            continue;
          }
        }
        case '|': {
          if (peek === '|') {
            next(2);
            tokens.push(new Token(TokenType.Operator, Operator.Or));
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
        [char, peek] = next();
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
  Expression = 'EXPRESSION',
  Operator = 'OPERATOR',
  Program = 'PROGRAM',
  String = 'STRING'
}

export abstract class Node {
  abstract readonly type: NodeType;

  value?: string;
}

export class ExpressionNode extends Node {
  readonly type = NodeType.Expression;

  left?: Node;

  operator?: OperatorNode;

  right?: Node;

  constructor(left?: Node, operator?: OperatorNode, right?: Node) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

export class OperatorNode extends Node {
  readonly type = NodeType.Operator;

  constructor(public readonly value: string) {
    super();
  }
}

export enum Operator {
  And = '&&',
  Equal = '=',
  NotEqual = '!=',
  Or = '||'
}

export enum Paren {
  Open = '(',
  Close = ')'
}

export class StringNode extends Node {
  readonly type = NodeType.String;

  constructor(public readonly value: string) {
    super();
  }
}

export class ProgramNode extends Node {
  readonly type = NodeType.Program;

  body: Node[];

  constructor(body: Node[] = []) {
    super();
    this.body = body;
  }
}

export interface ParseState {
  newExpression: boolean;
}
