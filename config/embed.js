const { avatar } = require('./config.js');
function newembed() {
  let em = {
    title: 'title',
    url: 'https://github.com/KelseyMichelle/goose-bot',
    color: 14375904,
    timestamp: new Date(),
    thumbnail: {
      url: avatar,
    },
    author: {
      name: 'goose',
    },
    fields: [],
  };
  let format = JSON.parse(JSON.stringify(em));
  return format;
}

module.exports = newembed;
