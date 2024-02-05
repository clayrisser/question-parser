import Bullean from 'bullean';
import _get from 'lodash.get';
import _set from 'lodash.set';
import { HashMap, Primative, HashMapValue } from './types';

export default class Question
  implements Omit<IQuestion, 'variable' | 'subquestions'>
{
  readonly default?: Primative;

  readonly description?: string;

  readonly group: string;

  readonly label: string;

  readonly options?: Primative[];

  readonly required?: boolean;

  readonly showIf?: string;

  readonly showSubquestionIf?: Primative;

  readonly type: QuestionType;

  readonly variable: string[];

  parent?: Question;

  subquestions: Question[] = [];

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

  isEnabled(values: HashMap) {
    const bullean = new Bullean(values);
    const parentValue: HashMapValue | undefined = this.parent
      ? _get(values, this.parent.variable)
      : undefined;
    return (
      (!this.showIf || bullean.eval(this.showIf)) &&
      (!this.parent?.showSubquestionIf ||
        this.parent?.showSubquestionIf === parentValue) &&
      (!this.showSubquestionIf ||
        this.showSubquestionIf === _get(values, this.variable))
    );
  }

  setValue(values: HashMap, value: Primative) {
    _set(values, this.variable, value);
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
