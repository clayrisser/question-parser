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
      label: 'hello',
      type: QuestionType.String,
      variable: 'hello'
    }),
    new Question({
      group: 'Config',
      label: 'world',
      type: QuestionType.String,
      variable: 'world',
      subquestions: [
        new Question({
          group: 'Config',
          label: 'howdy',
          type: QuestionType.String,
          variable: 'texas'
        })
      ]
    })
  ];

  it('should detect if enabled', () => {
    expect(questions[0].isEnabled({})).toBe(true);
  });
});

export default null;
