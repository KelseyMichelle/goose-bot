const fs = require('fs');
const prompt = require('prompt');
const configPath = './config/config.json';
const { memeFolder, memeLog } = require('./config/filepaths.js');

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
      pattern: /^(?i)([yn]|yes|no)$/,
      message: 'must answer yes/no or y/n',
      before: function (value) {
        value.match(/^(?i)(y|yes)$/);
      },
    },
    writeResponse: {
      description: 'reply to command? (y/n)',
      required: true,
      type: 'string',
      pattern: /^(?i)([yn]|yes|no)$/,
      message: 'must answer yes/no or y/n',
      before: function (value) {
        value.match(/^(?i)(y|yes)$/);
      },
    },
    defaultSpoiler: {
      description:
        'default to include spoiler images when requesting random images?',
    },
  },
};

const responseSchema = {
  properties: {
    message: {
      description: 'response to write',
      required: true,
      type: 'string',
    },
    withImage: {
      description: 'respond with image posted? (y/n)',
      required: true,
      type: 'string',
      pattern: /^(?i)([yn]|yes|no)$/,
      message: 'must answer yes/no or y/n',
      before: function (value) {
        value.match(/^(?i)(y|yes)$/);
      },
    },
  },
};

function generate() {
  let output = {};
  prompt.get(imageSchema, function (err, result) {
    //create new property with the name of the new stored image type
    output[result.name] = {};
    output[result.name]['deleteOriginal'] = result.deleteOriginal;
    let response = {};
    response['respond'] = result.writeResponse;
    if (result.writeResponse) {
      prompt.get(responseSchema, function (error, resResult) {
        output['writeResponse'] = {};
        response['message'] = resResult.message;
        response['withImage'] = resResult.withImage;
      });
    }
    output['writeResponse'] = response;
  });
}

function main() {
  prompt.get(['description', 'name']);
}

if (!fs.existsSync(configPath)) {
  let config = {};
  prompt.start();
  prompt.get('y_or_n', (err, ans) => {
    if (err) {
      return console.error(err);
    }
    if (ans.y_or_n.toLowerCase().trim() == 'y') {
      prompt.get(configVars, (err, result) => {
        config.prefix = result.prefix;
        config.avatar = result.avatar;
        config.token = result.token;
        saveConfig();
      });
    } else {
      console.log('no config file present, ending program');
      process.exit(1);
    }
  });
  function saveConfig() {
    config = { config: { prod: config } };
    fs.appendFileSync(
      configPath,
      JSON.stringify(config),
      function writeJSON(err) {
        if (err) return console.log(err);
        console.log('successfully wrote config.json');
      }
    );
  }
}
