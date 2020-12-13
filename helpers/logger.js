const fs = require('fs');
const memefolder = "./memes/"
const memeLogFile = `${memefolder}memes.json`;
const request = require(`request`);
const shortid = require('shortid');
const meme = require('../commands/meme');

function dataLog(file, data, print) {
    fs.appendFile(file, `${data},\n`, function (err) {
        if (err) throw err;
        if (print) console.log(data);
      })
}

function logMemes(message, args) {
    if (!fs.existsSync(memeLogFile)) {
        fs.appendFileSync(memeLogFile, `{}`, function (err) {
            if (err) throw err;
          });
    }
    let file = fs.readFileSync(memeLogFile);
    let memefile = JSON.parse(file);
    let guildID = message.guild.id;
    let memeName = args.join(" ").toLowerCase();
    if (!(memefile.hasOwnProperty(guildID))) {
        memefile[guildID] = {};
    }
    
    if (!(memefile[guildID].hasOwnProperty(memeName)))
    {
        memefile[guildID][memeName] = [];
    }
    message.attachments.every(a => {
            let fileID = shortid.generate();
            let memeFileName = fileID + "." + a["attachment"].split(".").reverse()[0];
            console.log(a["name"]);
            if (a["name"].startsWith("SPOILER_")) {
                memeFileName = "SPOILER_" + memeFileName;
            }
            request.get(a["attachment"]).on('error', console.error).pipe(fs.createWriteStream(memefolder + memeFileName));
            memefile[guildID][memeName].push(memeFileName);
        });
    fs.writeFile(memeLogFile, JSON.stringify(memefile), function writeJSON(err) {
        if (err) return console.log(err);
        message.channel.send(`successfully added ${memeName}`)
        return;
    })
    return;
}

module.exports = { log : dataLog, memeLog: logMemes}