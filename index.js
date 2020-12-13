const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const { prefix, token } = require("./config/config.json");
const access = require('./helpers/hasaccess.js');
const { log } = require('./helpers/logger.js');
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  let logInfo = `{author: "${message.author.tag}", authorID: "${message.author}", `;
  if (message.content.endsWith("(y/n)")) {
    logInfo += `command: "${message.content}"`;
    message.react("🇾");
    message.react("🇳");
    return;
  }

  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (!client.commands.has(command)) {
    logInfo += `command: "${message.content}", result: "error: the !${command} command does not exist!"}`;
    message.reply(`the !${command} command does not exist!`);
  }
  else { 
    try {
      logInfo += `command: "${message.content}", `;
      if (access.has_permission.check_tier(message, client.commands.get(command).access_level)) {
        client.commands.get(command).execute(message, args);
        logInfo += `result: "success"}`;
    } else {
        message.channel.send("you do not have permission to do this");
        logInfo += `result: "inadequate permissions"}`;
    }
    } catch (error) {
      console.error(error);
      message.reply("failure to execute command");
      logInfo += `result: "execution failure"}`;
      log("errors.txt", error + " \n", false);
    }
  }
  log("commandLog.txt", logInfo, true);
  return;
});

client.login(token);
