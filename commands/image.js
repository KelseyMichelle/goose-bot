const request = require(`request`);
const shortid = require('shortid');
const meme = require('../commands/meme');
const Discord = require('discord.js');
const fileFormats = ['.png', '.jpeg', '.jpg', '.bmp', '.gif'];
const imageFolder = './images/';
const fs = require('fs');

function randomIntRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function postImage(message, filePath) {
  let attachment = new Discord.MessageAttachment(
    filePath,
    filePath.split('/').reverse()[0]
  );
  message.channel.send(attachment);
}

function newImage(message, config, fileName) {
  let response = '';
  if (config.response.respond) {
    response = config.response.message;
  }
}
// function sendImage(message, imagePath) {}
function processImage(message, args, command) {
  const guildFolder = imageFolder + command + '/' + message.guild.id + '/';

  if (!fs.existsSync(guildFolder)) {
    fs.mkdirSync(guildFolder);
    fs.writeFileSync(`${guildFolder}/data.json`, {});
  }

  let config = require(`../images/${command}/${command}Config.json`);
  let data = require(`../images/${command}/${command}Data.json`);
  console.log(config);
  let fileName = '';

  //
  // check if there are any arguments.
  // if no, check if there are attachments. if no attachments, pull up random image.
  //

  if (args.length === 0) {
    if (!message.attachments.size > 0) {
      let fileNames = fs.readdirSync(guildFolder);
      if (fileNames.length === 1) {
        message.channel.send('that image archive is empty, unfortunately');
      }
      let num = fileNames.length;
      let pick = randomIntRange(0, num);
      while (num > 0) {
        if (!fileNames[pick].endsWith('.json')) {
          if (
            !config.defaultSpoiler &&
            !fileNames[pick].startsWith('SPOILER_')
          ) {
            break;
          } else if (config.defaultSpoiler) {
            break;
          }
        }
        fileNames.splice(pick, 1);
        num -= 1;
        pick = randomIntRange(0, num);
      }
      console.log(fileNames);
      if (!fileNames) {
        message.channel.send('that image archive is empty, unfortunately');
        return;
      }
      postImage(message, guildFolder + fileNames[pick]);
    } else {
      message.channel.send(
        'you have to provide a title to that image in order to submit it'
      );
      return;
    }
  } else {
    if (message.attachments.first()) {
      let fileName = createFilename(message);
    }
  }
}

function addFile(message, args, command) {
  if (args.length === 0) {
  }
}

function createFilename(message) {
  let attachment = message.attachments.first();
  let extension = '.' + attachment.name.split('.').reverse()[0];
  if (!extension in fileFormats) {
    message.channel.send(
      `sorry, that was not a valid file extension. acceptable file extensions: ${fileFormats.join(
        ', '
      )}`
    );
    return;
  }
  let fid = shortid.generate() + extension;
  fid = attachment.spoiler() ? `SPOILER_${fid}` : fid;
}
module.exports = {
  name: 'image',
  description: 'posts an image from the archive.',
  access_level: 0,
  hidden: false,
  execute(message, args, command) {
    return processImage(message, args, command);
  },
};
