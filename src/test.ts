import ConditionalInterpreter from './conditionalInterpreter';

const conditionalInterpreter = new ConditionalInterpreter(
  '(hel.lo=world&&(howdy!=te-xas))||f00=bar'
);
console.log(conditionalInterpreter.tokens);
