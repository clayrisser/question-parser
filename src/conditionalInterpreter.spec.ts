import ConditionalInterpreter, {
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
      '(hel.lo=world&&(howdy!=te-xas))||f00=bar'
    );
    conditionalInterpreter.parse();
  });
});
