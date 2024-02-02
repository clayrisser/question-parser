import { parseQuestions } from './parse';
import { IQuestion, QuestionType } from './question';

describe('parseQuestions()', () => {
  it('should parse questions', () => {
    const questions: IQuestion[] = [
      {
        group: 'Config',
        label: 'hello',
        type: QuestionType.String,
        variable: 'hello.enabled',
        subquestions: [
          {
            group: 'Config',
            label: 'hello',
            type: QuestionType.String,
            variable: 'hello.world'
          }
        ]
      }
    ];

    expect(parseQuestions(questions)).toMatchObject([
      {
        group: 'Config',
        label: 'hello',
        type: QuestionType.String,
        variable: ['hello', 'enabled'],
        subquestions: [
          {
            group: 'Config',
            label: 'hello',
            type: QuestionType.String,
            variable: ['hello', 'world']
          }
        ]
      }
    ]);
  });
});
