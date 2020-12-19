const { builtinModules } = require('module');

const imageSchema = {
  properties: {
    name: {
      description: 'enter name for image archive',
      required: true,
      type: 'string',
      pattern: /^[a-zA-Z0-9_.@()-]+$/,
      message: 'please input a value that would be valid as a filename',
    },
    deleteOriginal: {
      description: 'delete command message? (y/n)',
      required: true,
      type: 'string',
      pattern: /^([yn]|(yes|no))$/i,
      message: 'must answer yes/no or y/n',
      before: function (value) {
        return /^(y|yes)$/i.test(value);
      },
    },
    defaultSpoiler: {
      description:
        'default to include spoiler images when requesting random images? (y/n)',
      required: true,
      type: 'string',
      pattern: /^([yn]|(yes|no))$/i,
      message: 'must answer yes/no or y/n',
      before: function (value) {
        return /^(y|yes)$/i.test(value);
      },
    },
    writeResponse: {
      description: 'reply to command? (y/n)',
      required: true,
      type: 'string',
      pattern: /^([yn]|(yes|no))$/i,
      message: 'must answer yes/no or y/n',
      before: function (value) {
        return /^(y|yes)$/i.test(value);
      },
    },
  },
};

const responseSchema = {
  properties: {
    message: {
      description: 'response text',
      default: '',
      type: 'string',
    },
    withImage: {
      description: 'respond with image posted? (y/n)',
      required: true,
      type: 'string',
      pattern: /^([yn]|(yes|no))$/i,
      message: 'must answer yes/no or y/n',
      before: function (value) {
        return /^(y|yes)$/i.test(value);
      },
    },
  },
};

const configCheck = {
  properties: {
    answer: {
      description:
        'there seems to already be a config file with that name. overwrite? (y/n)',
      required: true,
      type: 'string',
      pattern: /^([yn]|(yes|no))$/i,
      message: 'must answer yes/no or y/n',
      before: function (value) {
        return /^(y|yes)$/i.test(value);
      },
    },
  },
};
const dataCheck = {
  properties: {
    answer: {
      description:
        'there seems to already be a data file with that name. overwrite? (y/n)',
      required: true,
      type: 'string',
      pattern: /^([yn]|(yes|no))$/i,
      message: 'must answer yes/no or y/n',
      before: function (value) {
        return /^(y|yes)$/i.test(value);
      },
    },
  },
};
module.exports = {
  imageSchema: imageSchema,
  responseSchema: responseSchema,
  dataCheck: dataCheck,
  configCheck: configCheck,
};
