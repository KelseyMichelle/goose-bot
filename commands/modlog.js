const fs = require('fs');
function getChannelMentions(mention) {
  const matches = mention.filter((x) => x.match(/^<#!?(\d+)>$/));
  if (!matches) return;
  console.log(matches);
  return matches;
}

module.exports = {
  name: 'modlog',
  description: 'determine which channel to put the mod log in',
  access_level: 0,
  hidden: true,
  execute(message, args) {
    let logConfig = require('../modlog/modlog.json');
    let channel = getChannelMentions(args);
    if (channel) {
      logConfig[message.guild.id] = channel[0];
      message.channel.send('new channel set for mod log');
      fs.writeFileSync('./modlog/modlog.json', JSON.stringify(logConfig));
    }
  },
};
