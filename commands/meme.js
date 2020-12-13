const fs = require('fs');
const Discord = require('discord.js');
const { memeFolder, memeLog } = require("../config/filepaths.js")
const { prefix } = require("../config/config.js");

function randomIntRange(min, max) {
    return Math.floor(Math.random() * (max - min)+min);
}

function postMeme(message, args) {
    let guildID = message.guild.id;
    let memeName = args.join(" ").toLowerCase();
    let memefile = JSON.parse(fs.readFileSync(memeLog));
    if (args.length === 0) {
        let memenames = Object.keys(memefile[guildID]);
        let memeNum = memenames.length;
        let memeIndex = randomIntRange(0, memeNum);
        let whichMeme = memenames[memeIndex];
        let meme = randomIntRange(0, memefile[guildID][whichMeme].length);
        let memeFilePath = memeFolder + memefile[guildID][whichMeme][meme];
        let memeFile = new Discord.MessageAttachment(memeFilePath, meme);
        message.channel.send(memeFile);
        return;
    }

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
    } else {
        let memeFilePath = memefile[guildID][memeName][0];
        let memeFile = new Discord.MessageAttachment(memeFilePath, memefile[guildID][memeName][0]);
        message.channel.send(memeFile);
    }
}

module.exports = {
    name: "meme",
    description: "posts a meme from the meme archive.",
    syntax: `${prefix+this.name} [meme name] (note: quotation marks are not needed here)`,
    access_level: 0,
    hidden: false,
    execute(message, args) {
      postMeme(message, args);
    },
  };
  