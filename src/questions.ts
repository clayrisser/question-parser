import _get from 'lodash.get';
import Question from './question';

export default class Questions {
  constructor(public questions: Question[]) {}

  get values() {
    return this.questions;
  }

  get shownQuestions() {
    return this.questions;
  }
}
