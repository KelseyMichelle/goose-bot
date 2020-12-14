const meme = require("./meme.js");
const { prefix } = require("../config/config.js");

module.exports = {
  name: "edgymeme",
  description:
    "posts a random edgy meme from the meme archive. if you add any arguments, it will act like the normal meme function",
  syntax: `${prefix + this.name}`,
  access_level: 0,
  hidden: false,
  execute(message, args, edgy) {
    meme.execute(message, args, true);
  },
};
