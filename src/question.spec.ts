import Question, { QuestionType } from './question';

describe('new Question()', () => {
  it('should create new question', () => {
    expect(
      !!new Question({
        group: 'Config',
        label: 'hello',
        type: QuestionType.String,
        variable: 'hello'
      })
    ).toBe(true);
  });
});

describe('new Question().isEnabled()', () => {
  const questions = [
    new Question({
      group: 'Config',
      label: 'howdy',
      type: QuestionType.String,
      showIf: 'hello.world=bar',
      variable: 'howdy'
    }),
    new Question({
      group: 'Config',
      label: 'hello world',
      type: QuestionType.String,
      variable: 'hello.world',
      showSubquestionIf: 'foo'
    })
  ];
  questions[1].addSubquestion(
    new Question({
      group: 'Config',
      label: 'hello texas',
      type: QuestionType.String,
      variable: 'hello.texas'
    })
  );

  it('should detect if enabled showSubquestionIf true', () => {
    expect(
      questions[1].subquestions[0].isEnabled({
        hello: {
          world: 'foo'
        }
      })
    ).toBe(true);
  });

  it('should detect if enabled showSubquestionIf false', () => {
    expect(
      questions[1].subquestions[0].isEnabled({
        hello: {
          world: 'bar'
        }
      })
    ).toBe(false);
  });

  it('should detect if enabled showIf true', () => {
    expect(
      questions[0].isEnabled({
        hello: {
          world: 'foo'
        }
      })
    ).toBe(false);
  });

  it('should detect if enabled showIf false', () => {
    expect(
      questions[0].isEnabled({
        hello: {
          world: 'bar'
        }
      })
    ).toBe(true);
  });
});

export default null;
