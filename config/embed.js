const { avatar } = require("./config.js");
function newembed() {
    let em = {
        "title": "title",
        "url": "https://discordapp.com",
        "color": 14375904,
        "timestamp": "2020-12-12T13:49:56.750Z",
        "thumbnail": {
          "url": avatar,
        },
        "author": {
          "name": "goose"
        },
        "fields": [
        ]
      };
    let format = JSON.parse(JSON.stringify(em));
    return format;
}

module.exports = newembed;