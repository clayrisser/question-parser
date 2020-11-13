import _get from 'lodash.get';
import { Primative } from './types';

export default class Question
  implements Omit<IQuestion, 'variable' | 'subquestions'> {
  default?: Primative;

  description?: string;

  group: string;

  label: string;

  options?: Primative[];

  parent?: Question;

  required?: boolean;

  showIf?: string;

  showSubquestionIf?: Primative;

  subquestions: Question[] = [];

  type: QuestionType;

  value?: Primative;

  variable: string[];

  constructor(question: IQuestion) {
    this.default = question.default;
    this.description = question.description;
    this.group = question.group;
    this.label = question.label;
    this.options = question.options;
    this.required = question.required;
    this.showIf = question.showIf;
    this.showSubquestionIf = question.showSubquestionIf;
    this.type = question.type;
    this.variable = question.variable.split('.');
  }

  addSubquestion(question: Question) {
    question.parent = this;
    this.subquestions.push(question);
  }

  show() {
    return (
      !this.parent?.showSubquestionIf ||
      this.parent?.showSubquestionIf === this.parent?.value
    );
  }

  setValue(value: Primative) {
    this.value = value;
  }
}

export interface IQuestion {
  default?: Primative;
  description?: string;
  group: string;
  label: string;
  options?: Primative[];
  required?: boolean;
  showIf?: string;
  showSubquestionIf?: Primative;
  subquestions?: IQuestion[];
  type: QuestionType;
  variable: string;
}

export enum QuestionType {
  Boolean = 'boolean',
  Enum = 'enum',
  Hostname = 'hostname',
  Int = 'int',
  Password = 'password',
  String = 'string'
}
