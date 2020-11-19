import Question, { IQuestion } from './question';

export function parseQuestions(
  questions: IQuestion[],
  parentQuestion?: Question
): Question[] {
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
    if (parentQuestion) parsedQuestion.addSubquestion(parsedQuestion);
    if (question.subquestions) {
      parseQuestions(question.subquestions, parsedQuestion);
    }
    return questions;
  }, []);
}
