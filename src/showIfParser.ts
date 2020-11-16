import pegjs, { Parser } from 'pegjs';
import showIfPegjs from './showIfParser.pegjs';

export default class ShowIfParser {
  parser: Parser;

  constructor() {
    this.parser = pegjs.generate(showIfPegjs);
  }

  parse(input: string) {
    return this.parser.parse(input);
  }
}
