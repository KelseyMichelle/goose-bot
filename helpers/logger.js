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
    let memeName = args.join(" ");
    if (!(memefile.hasOwnProperty(guildID))) {
        memefile[guildID] = {};
    }
    
    if (!(memefile[guildID].hasOwnProperty(memeName)))
    {
        memefile[guildID][memeName] = [];
    }
    message.attachments.every(a => {
            let fileID = shortid.generate();
            let memeFileName = memefolder + fileID + "." + a["attachment"].split(".").reverse()[0];
            console.log(memeFileName);
            request.get(a["attachment"]).on('error', console.error).pipe(fs.createWriteStream(memeFileName));
            memefile[guildID][memeName].push(memeFileName);
        });
    fs.writeFile(memeLogFile, JSON.stringify(memefile), function writeJSON(err) {
        if (err) return console.log(err);
        console.log("successfully wrote to file");
    })
}

module.exports = { log : dataLog, memeLog: logMemes}