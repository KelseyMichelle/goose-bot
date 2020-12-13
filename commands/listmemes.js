const embedStructure = require('../config/embed.js');
const fs = require('fs');
const memeFolder = "./memes/";
const memeLog = `${memeFolder}memes.json`;

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
    for (let i = 0; i < memeNames.length; ++i) {
        embed.title = "available memes";
        if (embed.fields)
        embed.fields.push({
            "name": `"${memeNames[i]}"`,
            "value": `${memefile[guildID][memeNames[i]].length} available meme${memefile[guildID][memeNames[i]].length > 1 ? "s" : ""} under this name`
        },);  
    }
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
  