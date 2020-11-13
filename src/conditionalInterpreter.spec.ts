import ConditionalInterpreter, {
  ExpressionNode,
  OperatorNode,
  ProgramNode,
  StringNode,
  Token,
  TokenType
} from './conditionalInterpreter';

describe('new ConditionalInterpreter()', () => {
  it('should tokenize', () => {
    const conditionalInterpreter = new ConditionalInterpreter(
      '(hel.lo=world&&(howdy!=te-xas))||f00=bar'
    );
    expect(conditionalInterpreter.tokens).toEqual([
      new Token(TokenType.Paren, '('),
      new Token(TokenType.String, 'hel.lo'),
      new Token(TokenType.Operator, '='),
      new Token(TokenType.String, 'world'),
      new Token(TokenType.Operator, '&&'),
      new Token(TokenType.Paren, '('),
      new Token(TokenType.String, 'howdy'),
      new Token(TokenType.Operator, '!='),
      new Token(TokenType.String, 'te-xas'),
      new Token(TokenType.Paren, ')'),
      new Token(TokenType.Paren, ')'),
      new Token(TokenType.Operator, '||'),
      new Token(TokenType.String, 'f00'),
      new Token(TokenType.Operator, '='),
      new Token(TokenType.String, 'bar')
    ]);
  });

  it('should parse', () => {
    const conditionalInterpreter = new ConditionalInterpreter(
      '(hel.lo=world&&(howdy!=te-xas))'
    );
    const ast = conditionalInterpreter.parse();
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

  it('should parse without parens', () => {
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
