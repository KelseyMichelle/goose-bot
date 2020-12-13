module.exports = {
  name: "ping",
  description: "pings it",
  access_level: 0,
  hidden: false,
  execute(message, args) {
    message.channel.send("Pong.");
  },
};
