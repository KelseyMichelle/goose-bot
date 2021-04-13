const { Util } = require('discord.js');

module.exports = {
  name: 'rename',
  description: 'assign a new nickname',
  hidden: false,
  access_level: 0,
  execute(message, args) {
    let user = message.mentions.members.first();

    if (!user) {
      message.channel.send('no user mentioned');
    } else if (message.mentions.members.keyArray().length > 1) {
      message.channel.send(
        'you may only change the nickname of one user at a time'
      );
    } else {
      let nick = Util.cleanContent(args.slice(1).join(' '), message);
      let oldName = user.displayName;
      user.setNickname(nick);
      message.channel.send(`${oldName} is now ${nick}`);
    }
  },
};
