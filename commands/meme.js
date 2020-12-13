const fs = require('fs');
const Discord = require('discord.js');
const { memeFolder, memeLog } = require("../config/filepaths.js")
const { prefix } = require("../config/config.js");

function randomIntRange(min, max) {
    return Math.floor(Math.random() * (max - min)+min);
}

function fileExists(fileName, memeName, guildID, memefile) {
    if (!fs.existsSync(memeFolder + fileName)) {
        memefile[guildID][memeName].splice(memefile[guildID][memeName].indexOf(fileName), 1);
        fs.writeFileSync(memeLog, JSON.stringify(memefile), function writeJSON(err) {
            if (err) return console.log(err);
        })
        return false;
    }
    return true;
}
function countFiles(memefile, guildID) {
    let keys = Object.keys(memefile[guildID]);
    for (let x = 0; x < keys.length; ++x) {
            if (memefile[guildID][keys[x]].length > 0)
            {
                return true;
            }
        }
    return false;
}
function parseName(filename) {
    if (!filename) {
        return "NOFILEGIVEN";
    }
    if (filename.startsWith('./memes')) {
        return filename.split("/").reverse()[0];
    }
    return filename;
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
        if (!fileExists(parseName(memefile[guildID][whichMeme][meme]), whichMeme, guildID, memefile)) {
             if (countFiles(memefile, guildID)) {
                postMeme(message, args);
             } else {
                 message.channel.send("there are no memes stored. go bug kelsey, she probably fucked something up.")
             }
             return;};
        let memeFilePath = memeFolder + parseName(memefile[guildID][whichMeme][meme]); 
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
    if (memefile[guildID][memeName].length === 0) {
        message.channel.send("alright, heres the deal. Somehow, the name for that meme exists but it doesn't have anything associated. you can add some if you'd like. Or complain to kelsey. Either works tbh.");
        return;
    }
    if (memefile[guildID][memeName].length > 1) {
        let meme = randomIntRange(0, memefile[guildID][memeName].length);
        let memeFilePath = memeFolder + memefile[guildID][memeName][meme];
        if (!fileExists(parseName(memefile[guildID][memeName][meme]), memeName, guildID, memefile)) { postMeme(message, args); return };
        let memeFile = new Discord.MessageAttachment(memeFilePath, meme);
        message.channel.send(memeFile);
    } else if (memefile[guildID][memeName].length === 1) {
        if (!fileExists(parseName(memefile[guildID][memeName][0]), memeName, guildID, memefile)) { postMeme(message, args); return };
        let memeFilePath = memeFolder + parseName(memefile[guildID][memeName][0]);
        let memeFile = new Discord.MessageAttachment(memeFilePath, parseName(memefile[guildID][memeName][0]));
        message.channel.send(memeFile);
    } else {
        message.channel.send("alright, heres the deal. Somehow, the name for that meme exists but it doesn't have anything associated. you can add some if you'd like. Or complain to kelsey. Please, though, try to have some agency okay?.");
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
  