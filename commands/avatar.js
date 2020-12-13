module.exports = {
  name: "avatar",
  description:
    "Produces the avatar URL for each user mentioned, or the one sending the message if no mentions",
  hidden: false,
  access_level: 0,
  execute(message, args) {
    if (message.mentions.users.size == 0) {
      return message.channel.send(
        `your profile picture url: <${message.author.displayAvatarURL({
          format: "png",
          dynamic: "true",
        })}>`
      );
    }
    const avatars = message.mentions.users.map((user) => {
      return message.channel.send(
        `${user.username}'s avatar url: <${user.displayAvatarURL({
          format: "png",
          dynamic: "true",
        })}>`
      );
    });
  },
};
