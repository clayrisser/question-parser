import ConditionalInterpreter from './conditionalInterpreter';

const conditionalInterpreter = new ConditionalInterpreter('hello=world');
conditionalInterpreter.parse();
console.log(conditionalInterpreter.tokens);
