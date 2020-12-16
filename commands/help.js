const embedStructure = require('../config/embed.js');
const fs = require('fs');
const { prefix } = require('../config/config.js');

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

const imageCommands = fs
  .readdirSync('./images')
  .filter((file) => fs.statSync('./images/' + file).isDirectory());

let commands = [];

for (const file of commandFiles) {
  if (file != 'help.js') {
    const command = require(`./${file}`);
    commands.push(command);
  }
}

let embed = embedStructure();
for (let i = 0; i < commands.length; ++i) {
  embed.title = 'available commands';
  if (!commands[i].hidden)
    embed.fields.push({
      name: prefix + commands[i].name,
      value: commands[i].description,
    });
}

embed.fields.push({
  name: 'image archives:',
  value: '\n.' + imageCommands.join('\n.'),
});

function listCommands(message) {
  message.channel.send({ embed });
}

module.exports = {
  name: 'help',
  description: 'lists commands',
  hidden: false,
  access_level: 0,
  execute(message, args) {
    if (args.length === 0) {
      listCommands(message);
    }
  },
};
