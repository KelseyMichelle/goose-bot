const { prefix } = require("../config/config.js");
const { memeLog } = require('../helpers/logger.js');


const fileFormats = ['.png', '.jpeg', '.jpg', '.bmp', '.gif'];

function addMeme(message, args) {
    let attachments = message.attachments;
    if (args.length === 0) {
        message.channel.send("failed to save meme, must give title");
        return;
    } else if (!attachments.first()) {
        message.channel.send("no images provided, please try again");
        return;
    } else if (!attachments.every((a) => { return fileFormats.some((f) => { 
        console.log(a.MessageAttachment);
        return a["attachment"].split("/").reverse()[0]})})) {
        message.channel.send("no valid filetypes provided");
    } else {
        memeLog(message, args);
    }
}

module.exports = {
    name: "addmeme",
    description: "adds a meme to the bot.",
    syntax: `${prefix}addmeme [title]\nmust also add an image as an attachment`,
    access_level: 0,
    hidden: false,
    execute(message, args) {
      addMeme(message, args);
    },
  };