const fs = require('fs');
const Discord = require('discord.js');
const memeFolder = "./memes/";
const memeLog = `${memeFolder}memes.json`;

function randomIntRange(min, max) {
    return Math.floor(Math.random() * Math.floor(max) + min);
}

function postMeme(message, args) {
    if (args.length === 0) {
        message.channel.send("failed to find meme, must give name");
        return;
    }
    let guildID = message.guild.id;
    let memeName = args.join(" ");
    let memefile = JSON.parse(fs.readFileSync(memeLog));
    if (!(guildID in memefile)) {
        message.channel.send("unable to find that meme, sorry :(");
        return;
    } else if(!(memeName in memefile[guildID])) {
        message.channel.send("unable to find that meme, sorry :(");
        return;
    }
    if (memefile[guildID][memeName].length > 1) {
        let meme = randomIntRange(0, memefile[guildID][memeName].length);
        let memeFilePath = memeFolder + memefile[guildID][memeName][meme];
        let memeFile = new Discord.MessageAttachment(memeFilePath, meme);
        message.channel.send(memeFile);
    }
}

module.exports = {
    name: "meme",
    description: "posts a meme from the meme archive",
    access_level: 0,
    hidden: false,
    execute(message, args) {
      postMeme(message, args);
    },
  };
  