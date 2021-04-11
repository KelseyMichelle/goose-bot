module.exports = {
  name: 'joker',
  description: 'the joker, baby',
  access_level: 0,
  hidden: true,
  execute(message, args) {
    var VC = message.member.voice.channel;
    if (!VC) return message.reply("you're not in a voice channel");
    VC.join()
      .then((connection) => {
        const dispatcher = connection.play('./audio/joker.mp3');
        dispatcher.on('end', (end) => {
          VC.leave();
        });
      })
      .catch(console.error);
  },
};
