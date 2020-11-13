import Question, { QuestionType } from './question';

describe('new Question', () => {
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

export default null;
