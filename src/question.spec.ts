import Question, { QuestionType } from './question';

describe('new Question()', () => {
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

describe('new Question().isEnabled()', () => {
  const questions = [
    new Question({
      group: 'Config',
      label: 'howdy',
      type: QuestionType.String,
      showIf: 'hello.world=bar',
      variable: 'howdy'
    }),
    new Question({
      group: 'Config',
      label: 'hello world',
      type: QuestionType.String,
      variable: 'hello.world',
      showSubquestionIf: 'foo'
    })
  ];
  questions[1].addSubquestion(
    new Question({
      group: 'Config',
      label: 'hello texas',
      type: QuestionType.String,
      variable: 'hello.texas'
    })
  );

  it('should detect if enabled showSubquestionIf true', () => {
    expect(
      questions[1].subquestions[0].isEnabled({
        hello: {
          world: 'foo'
        }
      })
    ).toBe(true);
  });

  it('should detect if enabled showSubquestionIf false', () => {
    expect(
      questions[1].subquestions[0].isEnabled({
        hello: {
          world: 'bar'
        }
      })
    ).toBe(false);
  });

  it('should detect if enabled showIf true', () => {
    expect(
      questions[0].isEnabled({
        hello: {
          world: 'foo'
        }
      })
    ).toBe(false);
  });

  it('should detect if enabled showIf false', () => {
    expect(
      questions[0].isEnabled({
        hello: {
          world: 'bar'
        }
      })
    ).toBe(true);
  });

  const mainQuestion = new Question({
    variable: 'config.onlyoffice.enabled',
    description: '',
    type: QuestionType.Boolean,
    required: false,
    label: 'enabled',
    group: 'OnlyOffice',
    showSubquestionIf: true
  });

  mainQuestion.addSubquestion(
    new Question({
      group: 'OnlyOffice',
      variable: 'config.onlyoffice.hostname',
      description: '',
      type: QuestionType.String,
      required: false,
      label: 'hostname'
    })
  );

  mainQuestion.addSubquestion(
    new Question({
      group: 'OnlyOffice',
      variable: 'config.onlyoffice.replicas',
      description: '',
      type: QuestionType.Int,
      required: true,
      label: 'replicas'
    })
  );

  const resourcesEnabledSubquestion = new Question({
    group: 'OnlyOffice',
    variable: 'config.onlyoffice.resources.enabled',
    description: '',
    type: QuestionType.Enum,
    options: ['defaults', 'custom', 'false'],
    required: true,
    label: 'resources defaults',
    showSubquestionIf: 'custom'
  });

  resourcesEnabledSubquestion.addSubquestion(
    new Question({
      group: 'OnlyOffice',
      variable: 'config.onlyoffice.resources.requests.cpu',
      description: '',
      type: QuestionType.String,
      required: true,
      label: 'resources requests cpu'
    })
  );

  resourcesEnabledSubquestion.addSubquestion(
    new Question({
      group: 'OnlyOffice',
      variable: 'config.onlyoffice.resources.requests.memory',
      description: '',
      type: QuestionType.String,
      required: true,
      label: 'resources requests memory'
    })
  );

  resourcesEnabledSubquestion.addSubquestion(
    new Question({
      group: 'OnlyOffice',
      variable: 'config.onlyoffice.resources.limits.cpu',
      description: '',
      type: QuestionType.String,
      required: true,
      label: 'resources limits cpu'
    })
  );

  resourcesEnabledSubquestion.addSubquestion(
    new Question({
      group: 'OnlyOffice',
      variable: 'config.onlyoffice.resources.limits.memory',
      description: '',
      type: QuestionType.String,
      required: true,
      label: 'resources limits memory'
    })
  );

  mainQuestion.addSubquestion(resourcesEnabledSubquestion);

  it('should detect if enabled showSubquestionIf true', () => {
    expect(
      resourcesEnabledSubquestion.isEnabled({
        config: {
          onlyoffice: {
            enabled: true,
            resources: {
              enabled: 'custom'
            }
          }
        }
      })
    ).toBe(true);
  });
});

export default null;
