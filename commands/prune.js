const upper = 100;
const lower = 2;

module.exports = {
  name: "prune",
  description: "prune x number of messages",
  hidden: false,
  access_level: 1,
  execute(message, args) {
    message.channel.bulkDelete(1);
    amount = parseInt(args[0]);
    if (isNaN(amount)) {
      return message.reply("that is not a valid number");
    } else if (amount < lower || amount > upper) {
      return message.reply(
        `invalid input range, must be within ${lower} and ${upper}`
      );
    }
    message.channel.bulkDelete(amount, true).catch((err) => {
      console.log(err);
      message.channel.send(
        "failed to prune messages. they are all likey > 2 weeks old."
      );
    });
  },
};
