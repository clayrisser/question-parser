import ShowIfParser from './showIfParser';

describe('new ShowIfParser().parse()', () => {
  it('should parse a show if expression', () => {
    const showIfParser = new ShowIfParser();
    const result = showIfParser.parse('hello=world');
    expect(result).toMatchObject({
      operator: '=',
      value: 'world',
      left: {
        name: 'hello',
        type: 'identifier'
      }
    });
  });

  it('should parse a complex show if expression', () => {
    const showIfParser = new ShowIfParser();
    const result = showIfParser.parse('hello=world&&howdy=texas||foo=bar');
    expect(result).toMatchObject({
      op: 'or',
      predicates: [
        {
          op: 'and',
          predicates: [
            {
              left: {
                name: 'hello',
                type: 'identifier'
              },
              operator: '=',
              value: 'world'
            },
            {
              left: {
                name: 'howdy',
                type: 'identifier'
              },
              operator: '=',
              value: 'texas'
            }
          ]
        },
        {
          left: {
            name: 'foo',
            type: 'identifier'
          },
          operator: '=',
          value: 'bar'
        }
      ]
    });
  });

  it('should support order of operations', () => {
    const showIfParser = new ShowIfParser();
    const result = showIfParser.parse('hello=world&&(howdy=texas||foo=bar)');
    expect(result).toMatchObject({
      op: 'and',
      predicates: [
        {
          left: {
            name: 'hello',
            type: 'identifier'
          },
          operator: '=',
          value: 'world'
        },
        {
          op: 'or',
          predicates: [
            {
              left: {
                name: 'howdy',
                type: 'identifier'
              },
              operator: '=',
              value: 'texas'
            },
            {
              left: {
                name: 'foo',
                type: 'identifier'
              },
              operator: '=',
              value: 'bar'
            }
          ]
        }
      ]
    });
  });
});
