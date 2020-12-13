const embedStructure = require('../config/embed.js');
const fs = require('fs');
const { memeLog } = require("../config/filepaths.js")

function alreadyEmbeded(guildID,name)  {
    for (let x in embed.fields) {
        if (x === name) {
            return false;
        }
    }
    return true;
}

function listMemes(message, args) {
    let embed = embedStructure();
    let memefile = JSON.parse(fs.readFileSync(memeLog));
    let guildID = message.guild.id;
    if (!(guildID in memefile)) {
        message.channel.send("there are no memes for your server :(");
        return;
    }
    let memeNames = Object.keys(memefile[guildID]);
    let result = ``;
    for (let i = 0; i < memeNames.length; ++i) {
        result += `${memeNames[i]} - ${memefile[guildID][memeNames[i]].length} available\n`
    }
    embed.title = "listmemes";
    if (embed.fields)
        embed.fields.push({
            "name": "available memes",
            "value": result,
        },);  
    message.channel.send({ embed });
}

module.exports = {
    name: "listmemes",
    description: "list the memes we've got in our archive",
    access_level: 0,
    hidden: false,
    execute(message, args) {
      listMemes(message, args);
    },
  };
  