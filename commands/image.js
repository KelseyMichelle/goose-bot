const https = require('https');
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

function fetchImage(message, guildFolder, args, data) {
  let title = args.join(' ');
  console.log(data);
  if (!data[title]) {
    message.channel.send(
      "there doesn't appear to be a picture under that name"
    );
    return;
  } else if (data[title].length === 0) {
    message.channel.send(
      "there doesn't appear to be a picture under that name"
    );
    return;
  } else {
    let num = data[title].length;
    let pick = randomIntRange(0, data[title].length);
    let options = data[title].slice();
    while (num > 0) {
      if (fs.existsSync(guildFolder + options[pick])) {
        break;
      }
      options.splice(pick, 1);
      num -= 1;
      pick = randomIntRange(0, num);
    }
    if (num > 0) {
      postImage(message, guildFolder + options[pick]);
    } else {
      message.channel.send(
        "there doesn't appear to be a picture under that name"
      );
    }
  }
}

function newImage(message, args, guildFolder, config, data) {
  let fileName =
    shortid.generate() +
    '.' +
    message.attachments.first().name.split('.').reverse()[0];

  if (message.attachments.first().name.startsWith('SPOILER_')) {
    fileName = 'SPOILER_' + fileName;
  }
  let filePath = guildFolder + fileName;
  console.log(message.attachments.first().attachment);
  //   request
  //     .get(message.attachments.first().attachment)
  //     .on('error', console.error)
  //     .pipe(fs.createWriteStream(guildFolder + fileName))
  //     .on('finish', respond);
  let file = fs.createWriteStream(guildFolder + fileName);
  let req = https.get(message.attachments.first().attachment, function (res) {
    res.pipe(file);
    file.on('finish', respond);
    file.on('error', console.log);
  });
  function respond() {
    let response = { text: config.writeResponse.message, image: '' };

    if (config.writeResponse.respond) {
      response.response = config.writeResponse.message;
      if (config.writeResponse.withImage) {
        response.image = new Discord.MessageAttachment(
          guildFolder + fileName,
          fileName
        );
      }
      message.channel.send(response.text, response.image);
      let title = args.join(' ');
      if (!data[title]) {
        data[title] = [];
      }
      data[title].push(fileName);
      console.log(data);
      fs.writeFile(guildFolder + 'data.json', JSON.stringify(data), (err) => {
        if (err) console.log(error);
        if (config.deleteOriginal) {
          message.delete();
        }
      });
    }
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
  let data = require(`.${guildFolder}data.json`);

  //
  // check if there are any arguments.
  // if no, check if there are attachments. if no attachments, pull up random image.
  //

  if (args.length === 0) {
    if (!message.attachments.first()) {
      let fileNames = fs.readdirSync(guildFolder);
      if (fileNames.length === 1) {
        message.channel.send('that image archive is empty, unfortunately');
        return;
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
      newImage(message, args, guildFolder, config, data);
      return;
    }
    fetchImage(message, guildFolder, args, data);
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
