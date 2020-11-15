import ConditionalInterpreter, {
  ExpressionNode,
  Operator,
  OperatorNode,
  StringNode,
  Token,
  TokenType
} from './conditionalInterpreter';

describe('new ConditionalInterpreter()', () => {
  it.skip('should tokenize', () => {
    const conditionalInterpreter = new ConditionalInterpreter(
      '(hel.lo=world&&(howdy!=te-xas))||f00=bar'
    );
    expect(conditionalInterpreter.tokens).toEqual([
      new Token(TokenType.Paren, '('),
      new Token(TokenType.Paren, '('),
      new Token(TokenType.Paren, '('),
      new Token(TokenType.Paren, '('),
      new Token(TokenType.Paren, '('),
      new Token(TokenType.Paren, '('),
      new Token(TokenType.String, 'hel.lo'),
      new Token(TokenType.Operator, '='),
      new Token(TokenType.String, 'world'),
      new Token(TokenType.Paren, ')'),
      new Token(TokenType.Operator, '&&'),
      new Token(TokenType.Paren, '('),
      new Token(TokenType.Paren, '('),
      new Token(TokenType.Paren, '('),
      new Token(TokenType.Paren, '('),
      new Token(TokenType.String, 'howdy'),
      new Token(TokenType.Operator, '!='),
      new Token(TokenType.String, 'te-xas'),
      new Token(TokenType.Paren, ')'),
      new Token(TokenType.Paren, ')'),
      new Token(TokenType.Paren, ')'),
      new Token(TokenType.Paren, ')'),
      new Token(TokenType.Paren, ')'),
      new Token(TokenType.Paren, ')'),
      new Token(TokenType.Paren, ')'),
      new Token(TokenType.Paren, ')'),
      new Token(TokenType.Operator, '||'),
      new Token(TokenType.Paren, '('),
      new Token(TokenType.Paren, '('),
      new Token(TokenType.String, 'f00'),
      new Token(TokenType.Operator, '='),
      new Token(TokenType.String, 'bar'),
      new Token(TokenType.Paren, ')'),
      new Token(TokenType.Paren, ')'),
      new Token(TokenType.Paren, ')')
    ]);
  });

  it.skip('should parse =', () => {
    const conditionalInterpreter = new ConditionalInterpreter('hello=world');
    const ast = conditionalInterpreter.parse();
    expect(ast).toMatchObject(
      new ExpressionNode(
        new StringNode('hello'),
        new OperatorNode(Operator.Equal),
        new StringNode('world')
      )
    );
  });

  it.skip('should parse !=', () => {
    const conditionalInterpreter = new ConditionalInterpreter('hello!=world');
    const ast = conditionalInterpreter.parse();
    expect(ast).toMatchObject(
      new ExpressionNode(
        new StringNode('hello'),
        new OperatorNode(Operator.NotEqual),
        new StringNode('world')
      )
    );
  });

  it.skip('should parse = (no right)', () => {
    const conditionalInterpreter = new ConditionalInterpreter('hello=');
    const ast = conditionalInterpreter.parse();
    expect(ast).toMatchObject(
      new ExpressionNode(
        new StringNode('hello'),
        new OperatorNode(Operator.Equal),
        null
      )
    );
  });

  it('should parse &&', () => {
    const conditionalInterpreter = new ConditionalInterpreter(
      'hello=world&&howdy=texas'
    );
    const ast = conditionalInterpreter.parse();
    expect(ast).toMatchObject(
      new ExpressionNode(
        new ExpressionNode(
          new StringNode('hello'),
          new OperatorNode(Operator.Equal),
          new StringNode('world')
        ),
        new OperatorNode(Operator.And),
        new ExpressionNode(
          new StringNode('howdy'),
          new OperatorNode(Operator.Equal),
          new StringNode('texas')
        )
      )
    );
  });

  it.skip('should parse without parens', () => {
    const conditionalInterpreter = new ConditionalInterpreter(
      '((hel.lo=world)&&(howdy!=te-xas))'
    );
    console.log('TOKENS');
    console.log(JSON.stringify(conditionalInterpreter.tokens, null, 2));
    const ast = conditionalInterpreter.parse();
    console.log('AST');
    console.log(JSON.stringify(ast, null, 2));
    expect(ast).toMatchObject(
      new ProgramNode([
        new ExpressionNode(
          new StringNode('hel.lo'),
          new OperatorNode('='),
          new StringNode('world')
        ),
        new ExpressionNode(
          new StringNode('howdy'),
          new OperatorNode('!='),
          new StringNode('te-xas')
        )
      ])
    );
  });
});

describe('ConditionalInterpreter.parenthasize()', () => {
  it.skip('should parenthasize', () => {
    expect(ConditionalInterpreter.parenthesize('hello=world')).toBe(
      '(((hello=world)))'
    );
    expect(
      ConditionalInterpreter.parenthesize(
        'hello=world||howdy=texas&&hello=world'
      )
    ).toBe('(((hello=world))||((howdy=texas)&&(hello=world)))');
  });
});
