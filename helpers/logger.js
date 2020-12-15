const fs = require('fs');
let {
  archiveFolder,
  memeFolder,
  memeLog,
  archiveLog,
} = require('../config/filepaths.js');
const request = require(`request`);
const shortid = require('shortid');
const meme = require('../commands/meme');
const Discord = require('discord.js');

function dataLog(file, data, print) {
  fs.appendFile(file, `${data},\n`, function (err) {
    if (err) throw err;
    if (print) console.log(data);
  });
}

function logMemes(message, args, type) {
  if (!fs.existsSync(`./${type}/`)) {
    console.log(`generating ${type} folder and json file`);
    fs.mkdirSync(`./${type}`);
  }
  let memeLogFile = memeLog;
  let memeFolders = memeFolder;

  if (type === 'archive') {
    memeLogFile = archiveLog;
    memeFolders = archiveFolder;
  }
  if (!fs.existsSync(memeLogFile)) {
    fs.appendFileSync(memeLogFile, `{}`, function (err) {
      if (err) throw err;
    });
  }
  let file = fs.readFileSync(memeLogFile);
  let memefile = JSON.parse(file);
  let guildID = message.guild.id;
  let memeName = args.join(' ').toLowerCase();
  if (!memefile.hasOwnProperty(guildID)) {
    memefile[guildID] = {};
  }

  if (!memefile[guildID].hasOwnProperty(memeName)) {
    memefile[guildID][memeName] = [];
  }
  let fileID = shortid.generate();
  let memeFileName =
    fileID +
    '.' +
    message.attachments.first()['attachment'].split('.').reverse()[0];
  let theFN = memeFileName.split('').join('');
  message.attachments.every((a) => {
    if (a['name'].startsWith('SPOILER_')) {
      memeFileName = 'SPOILER_' + memeFileName;
    }
    request
      .get(a['attachment'])
      .on('error', console.error)
      .pipe(fs.createWriteStream(memeFolders + memeFileName))
      .on('finish', writeFile);
    memefile[guildID][memeName].push(memeFileName);
    fileID = shortid.generate();
    memeFileName = fileID + '.' + a['attachment'].split('.').reverse()[0];
  });
  function writeFile() {
    fs.writeFile(
      memeLogFile,
      JSON.stringify(memefile),
      function writeJSON(err) {
        if (err) return console.log(err);
        if (type === 'archive') {
          let memeFile = new Discord.MessageAttachment(
            archiveFolder + theFN,
            theFN
          );
          message.channel.send('#oneforthearchives', memeFile);
          message.delete();
          return;
        }
        message.channel.send(`successfully added ${memeName}`);
        return;
      }
    );
  }
  return;
}

module.exports = { log: dataLog, memeLog: logMemes };
