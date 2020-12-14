const listMemes = require("../commands/listmemes.js");

module.exports = {
  name: "listarchive",
  description: "list the archive we've accumulated so far",
  access_level: 0,
  hidden: false,
  execute(message, args, type) {
    if (type === undefined) {
      listMemes.execute(message, args, "archive");
    } else {
      listMemes.execute(message, args, type);
    }
  },
};
