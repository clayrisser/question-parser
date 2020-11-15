export default class ConditionalInterpreter {
  tokens: Token[];

  static WHITESPACE = /\s/;

  static STRING = /[^)!=&|]/;

  constructor(public readonly input: string) {
    this.tokens = ConditionalInterpreter.tokenize(
      ConditionalInterpreter.parenthesize(input)
    );
  }

  /**
   * based on Fortran I compiler order of operations
   * http://polaris.cs.uiuc.edu/publications/c1070.pdf
   */
  static parenthesize(input: string) {
    let output = '(((';
    let current = 0;
    const next = (times = 1): [string, string | undefined] => {
      current += times;
      return [input[current], input[current + 1]];
    };
    while (current < input.length) {
      const [char, nextChar] = next(0);
      switch (char) {
        case '(': {
          output += '(((';
          next();
          continue;
        }
        case ')': {
          output += ')))';
          next();
          continue;
        }
      }
      switch (`${char}${nextChar}`) {
        case '&&': {
          output += ')&&(';
          next(2);
          continue;
        }
        case '||': {
          output += '))||((';
          next(2);
          continue;
        }
      }
      output += char;
      next();
    }
    output += ')))';
    return output;
  }

  parse() {
    let current = 0;
    const next = (times = 1): [Token | undefined, Token | undefined] => {
      current += times;
      return [this.tokens[current], this.tokens[current + 1]];
    };
    console.log(JSON.stringify(this.tokens, null, 2));
    const walk = (): Node => {
      let [token, nextToken] = next(0);
      console.log(current, token, nextToken);
      if (token?.type === TokenType.Paren && token?.value === '(') {
        const expression: Node[] = [];
        [token, nextToken] = next();
        while (
          token?.type !== TokenType.Paren ||
          (token.type === TokenType.Paren && token.value !== ')')
        ) {
          expression.push(walk());
          [token, nextToken] = next(0);
          if (typeof token === 'undefined') {
            throw new Error('token cannot be undefined');
          }
        }
        console.log('E', expression);
        if (expression.length === 1) {
          // maybe make it better
          return expression[0];
        } else if (expression.length < 2) {
          throw new Error(
            `expression '${expression
              .map((node: Node) => node.value)
              .join(' ')}' is invalid`
          );
        }
        const [left, , right] = expression;
        const operator = expression[1] as OperatorNode;
        if (left.type !== NodeType.String) {
          throw new Error(
            `left of type ${left.type} should be type ${NodeType.String}`
          );
        }
        if (operator.type !== NodeType.Operator) {
          throw new Error(
            `operator of type ${operator.type} should be type ${NodeType.Operator}`
          );
        }
        return new ExpressionNode(left, operator, right || null);
      }
      switch (token?.type) {
        case TokenType.String: {
          next();
          return new StringNode(token?.value || '');
        }
        case TokenType.Operator: {
          next();
          return new OperatorNode(token?.value || '');
        }
      }
      throw new Error(
        `token type ${token?.type} with value ${token?.value} is invalid`
      );
    };
    const result = walk();
    console.log('R', result);
    return result;
  }

  static tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    const inputArray = [...input];
    let current = 0;
    const next = (times = 1): [string, string | undefined] => {
      current += times;
      return [inputArray[current], inputArray[current + 1]];
    };
    while (current < inputArray.length) {
      let [char, nextChar] = next(0);
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
          if (nextChar === '=') {
            next(2);
            tokens.push(new Token(TokenType.Operator, Operator.NotEqual));
            continue;
          }
        }
        case '&': {
          if (nextChar === '&') {
            next(2);
            tokens.push(new Token(TokenType.Operator, Operator.And));
            continue;
          }
        }
        case '|': {
          if (nextChar === '|') {
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
        [char, nextChar] = next();
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

  right?: Node | null;

  constructor(left?: Node, operator?: OperatorNode, right?: Node | null) {
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

export interface ParseState {
  newExpression: boolean;
}
