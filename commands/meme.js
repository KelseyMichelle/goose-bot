const fs = require('fs');
const Discord = require('discord.js');
let { memeFolder, memeLog, archiveFolder, archiveLog} = require("../config/filepaths.js")
const { prefix } = require("../config/config.js");

function randomIntRange(min, max) {
    return Math.floor(Math.random() * (max - min)+min);
}

function fileExists(fileName, memeName, guildID, memefile, edgy) {
    if (!fileName) {
        return false;
    }
    if ((edgy && fileName.startsWith("SPOILER_")) || (!edgy && !fileName.startsWith("SPOILER_"))) {
        if (!fs.existsSync(memeFolder + fileName)) {
            memefile[guildID][memeName].splice(memefile[guildID][memeName].indexOf(fileName), 1);
            fs.writeFileSync(memeLog, JSON.stringify(memefile), function writeJSON(err) {
                if (err) return console.log(err);
            })
            return false;
        }
    }
    return true;
}
function fileExistsReg(fileName, memeName, guildID, memefile) {
    if (!fs.existsSync(memeFolder + fileName)) {
        memefile[guildID][memeName].splice(memefile[guildID][memeName].indexOf(fileName), 1);
        fs.writeFileSync(memeLog, JSON.stringify(memefile), function writeJSON(err) {
            if (err) return console.log(err);
        })
        return false;
    }
    return true;
}


function countFiles(memefile, guildID, edgy) {
    let keys = Object.keys(memefile[guildID]);
    for (let x = 0; x < keys.length; ++x) {
            if (edgy) {
                for (let i = 0; i < memefile[guildID][keys[x]].length; ++i) {
                    if (memefile[guildID][keys[x]][i].startsWith("SPOILER_")) {
                        return true;
                    }
                }
            } else {
                if (memefile[guildID][keys[x]].length > 0)
                {
                    return true;
                }
            }
        }
    return false;
}
function parseName(filename) {
    if (!filename) {
        return false;
    }
    if (filename.startsWith('./memes')) {
        return filename.split("/").reverse()[0];
    }
    console.log("leaving parsename: " + filename);
    return filename;
}

function postMeme(message, args, edgy, type) {
    if (type === "archive") {
        memeFolder = archiveFolder;
        memeLog = archiveLog;
    }
    let guildID = message.guild.id;
    let memeName = args.join(" ").toLowerCase();
    let memefile = JSON.parse(fs.readFileSync(memeLog));
    if (args.length === 0 && !(memefile[guildID] === undefined)) {
        let memenames = Object.keys(memefile[guildID]);
        let memeNum = memenames.length;
        let memeIndex = randomIntRange(0, memeNum);
        let whichMeme = memenames[memeIndex];
        let meme = randomIntRange(0, memefile[guildID][whichMeme].length);
        console.log(memefile[guildID][whichMeme][meme]);
        if (!fileExists(parseName(memefile[guildID][whichMeme][meme]), whichMeme, guildID, memefile, edgy)) {
             if (countFiles(memefile, guildID, edgy)) {
                postMeme(message, args, edgy);
             } else {
                message.channel.send(`there are no ${edgy ? "edgy " : ""} ${type} stored. go bug kelsey, she probably messed something up.`)
             }
             return;
            };
        let memeFilePath = parseName(memefile[guildID][whichMeme][meme]); 
        if ((memeFilePath.startsWith("SPOILER_") && !edgy) || (!memeFilePath.startsWith("SPOILER_") && edgy)) {
            console.log(`if edgy is ${edgy}, it evaluates to ${memeFilePath.startsWith("SPOILER_") && !edgy}`);
            if (!countFiles(memefile,guildID, edgy)) {
                message.channel.send(`there arent any ${edgy ? "edgy" : "normie"} ${type}s!`);
                return;
            }
            postMeme(message, args, edgy);
            return;
        }
        memeFilePath = memeFolder + memeFilePath;
        let memeFile = new Discord.MessageAttachment(memeFilePath, meme);
        message.channel.send(memeFile);
        return;
    } else { if (!(guildID in memefile)) {
            message.channel.send(`unable to find that ${type}, sorry :(`);
            return;
        } else if(!(memeName in memefile[guildID])) {
            message.channel.send(`unable to find that ${type}, sorry :(`);
            return;
        }
        if (memefile[guildID][memeName].length === 0) {
            message.channel.send(`alright, heres the deal. Somehow, the name for that meme exists but it doesn't have anything associated. you can add some if you'd like. Or complain to kelsey. Please, though, try to have some agency okay?`);
            return;
        }
        if (memefile[guildID][memeName].length > 1) {
            let meme = randomIntRange(0, memefile[guildID][memeName].length);
            let memeFilePath = memeFolder + memefile[guildID][memeName][meme];
            if (!fileExistsReg(parseName(memefile[guildID][memeName][meme]), memeName, guildID, memefile)) { postMeme(message, args, edgy); return };
            let memeFile = new Discord.MessageAttachment(memeFilePath, meme);
            message.channel.send(memeFile);
        } else if (memefile[guildID][memeName].length === 1) {
            if (!fileExistsReg(parseName(memefile[guildID][memeName][0]), memeName, guildID, memefile)) { postMeme(message, args); return };
            let memeFilePath = memeFolder + parseName(memefile[guildID][memeName][0]);
            let memeFile = new Discord.MessageAttachment(memeFilePath, parseName(memefile[guildID][memeName][0]));
            message.channel.send(memeFile);
            return;
        } else {
            message.channel.send(`alright, heres the deal. Somehow, the name for that ${type} exists but it doesn't have anything associated. you can add some if you'd like. Or complain to kelsey. Please, though, try to have some agency okay?`);
        }
}
}

module.exports = {
    name: "meme",
    description: "posts a meme from the meme archive.",
    syntax: `${prefix+this.name} [meme name] (note: quotation marks are not needed here)`,
    access_level: 0,
    hidden: false,
    execute(message, args, edgy, type) {
        if (edgy === undefined) {
            postMeme(message, args, false, "meme");
        }
        else {
            if(type === undefined) {
                postMeme(message, args, edgy, "meme");
            }
            postMeme(message, args, edgy, type)
        }
    },
  };
  