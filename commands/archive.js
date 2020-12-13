const meme = require('./meme.js');
const { prefix } = require("../config/config.js");
const { memeLog } = require('../helpers/logger.js');
const { logger } = require('../helpers/logger.js');

const fileFormats = ['.png', '.jpeg', '.jpg', '.bmp', '.gif'];

function addArchive(message, args, edgy, type) {
    let attachments = message.attachments;
    if (args.length === 0) {
        message.channel.send("failed to save archive, must give title");
        return;
    } else if (!attachments.first()) {
        message.channel.send("no images provided, please try again");
        return;
    } else if (!attachments.every((a) => { return fileFormats.some((f) => { 
        console.log(a.MessageAttachment);
        return a["attachment"].split("/").reverse()[0]})})) {
        message.channel.send("no valid filetypes provided");
    } else {
        memeLog(message, args, type);
    }
}

module.exports = {
    name: "archive",
    description: "posts an archived #oneforthearchives item, or adds if theres an attachment included ",
    syntax: `${prefix+this.name} [archive name] (note: quotation marks are not needed here)`,
    access_level: 0,
    hidden: false,
    execute(message, args, edgy, type) {
        let attachments = message.attachments;
        if (!attachments.first()) {
            if (edgy === undefined) {
                if (type === undefined) {
                    meme.execute(message, args, false, "archive");
                } else {
                    meme.execute(message, args,false, type);
                }
            }
            else {
                meme.execute(message, args, edgy, type);
            }
                
        
        } else {
            if (edgy === undefined) {
                if(type === undefined) {
                    addArchive(message, args, false, "archive");
                } else {
                    addArchive(message, args, false, type);
                }
            }
            else {
                addArchive(message, args, edgy, type)
            }
        }
        
    },
  };
  