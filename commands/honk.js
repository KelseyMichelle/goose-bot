module.exports = {
  name: 'honk',
  description: 'honk?',
  access_level: 0,
  hidden: false,
  execute(message, args) {
    message.channel.send(
      ':regional_indicator_h: :regional_indicator_o: :regional_indicator_n: :regional_indicator_k: !'
    );
  },
};
