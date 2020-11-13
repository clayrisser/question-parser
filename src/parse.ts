import Question, { IQuestion } from './question';

export function parseQuestions(questions: IQuestion[]): Question[] {
  return questions.reduce((questions: Question[], question: IQuestion) => {
    const parsedQuestion = new Question({
      default: question.default,
      description: question.description,
      group: question.group,
      label: question.label,
      options: question.options,
      required: question.required,
      showIf: question.showIf,
      showSubquestionIf: question.showSubquestionIf,
      type: question.type,
      variable: question.variable
    });
    if (question.subquestions) {
      parsedQuestion.subquestions = parseQuestions(question.subquestions);
    }
    questions.push(parsedQuestion);
    return questions;
  }, []);
}
