const fs = require('fs');
const prompt = require('prompt');
const configFolder = './config/';
const {
  imageSchema,
  responseSchema,
  configCheck,
  dataCheck,
} = require('./config/schemas.js');

const imageFolder = './images/';
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

const commands = commandFiles.map((file) => file.split('.')[0]);

function generate() {
  if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder);
  }

  let output = {};
  prompt.get(imageSchema, function (err, result) {
    //create new property with the name of the new stored image type
    if (commands.includes(result.name)) {
      console.log(
        'unforuntately, there already exists a non-image command with that name. please try another one.'
      );
      process.exit(1);
    } else {
      output['name'] = result.name;
      output['description'] = `config file for ${result.name} folder`;
      output['deleteOriginal'] = result.deleteOriginal;
      output['defaultSpoiler'] = result.defaultSpoiler;
      output['writeResponse'] = { respond: false };
      let response = {};
      if (result.writeResponse) {
        prompt.get(responseSchema, function (error, resResult) {
          output['writeResponse'] = {};
          response['message'] = resResult.message;
          response['withImage'] = resResult.withImage;
          response['respond'] = true;
          output['writeResponse'] = response;
          check(output);
        });
      } else {
        check(output);
      }
    }
  });
}

function check(output) {
  // do the directories exist?
  if (!fs.existsSync(imageFolder + output.name)) {
    fs.mkdirSync(imageFolder + output.name);
  } else if (!fs.existsSync(imageFolder + '/' + output.name)) {
    fs.mkdirSync(imageFolder + '/' + output.name);
  }
  let wConfig = true;
  let wData = true;

  if (
    fs.existsSync(imageFolder + output.name + '/' + output.name + 'Config.json')
  ) {
    prompt.get(configCheck, function (err, ans) {
      if (!ans.answer) {
        wConfig = false;
        dataWrite();
      } else dataWrite();
    });
  } else dataWrite();
  function dataWrite() {
    if (
      fs.existsSync(imageFolder + output.name + '/' + output.name + 'Data.json')
    ) {
      prompt.get(dataCheck, function (err, ans) {
        if (!ans.answer) {
          wData = false;
          create();
        } else create();
      });
    } else {
      create();
    }
  }

  function create() {
    let jsonString = JSON.stringify(output);
    if (wData) {
      fs.writeFileSync(
        imageFolder + output.name + '/' + output.name + 'Data.json',
        '{}',
        function writeJSON(err) {
          if (err) return console.log(err);
        }
      );
    }
    if (wConfig) {
      let depth = 0;

      jsonString = jsonString.replace(/{/g, '\n{\n').replace(/,/g, ',\n');
      jsonString = jsonString
        .split('')
        .map((symbol) => {
          if (symbol === '{') {
            depth += 1;
          } else if (symbol === '}') {
            depth -= 1;
            return '\n' + '\t'.repeat(depth) + '}';
          } else if (symbol === '\n') {
            return '\n' + '\t'.repeat(depth);
          }
          return symbol;
        })
        .join('')
        .trim();
      fs.writeFileSync(
        imageFolder + output.name + '/' + output.name + 'Config.json',
        jsonString,
        function writeJSON(err) {
          if (err) return console.log(err);
        }
      );
    }
  }
}

generate();
