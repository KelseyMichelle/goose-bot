const { GuildMember, Guild, DiscordAPIError } = require("discord.js");
const access = require("../helpers/hasaccess.js");
const Discord = require("discord.js");

let rolePerms = {
  "-admin": {
    permissions: ["ADMINISTRATOR"],
    requirement: ["ADMINISTRATOR"],
    restrictions: [],
    mentionable: true,
  },
  "-meme": {
    permissions: [],
    requirement: [],
    restrictions: ["MENTION_EVERYONE"],
    mentionable: true,
  },
  "-mod": {
    permissions: [
      "MANAGE_ROLES",
      "BAN_MEMBERS",
      "KICK_MEMBERS",
      "MANAGE_NICKNAMES",
      "CHANGE_NICKNAME",
      "MOVE_MEMBERS",
      "MENTION_EVERYONE",
      "MANAGE_EMOJIS",
      "ADD_REACTIONS",
      "MANAGE_MESSAGES",
    ],
    requirement: ["ADMINISTRATOR"],
    mentionable: true,
  },
};

module.exports = {
  name: "addrole",
  description: "create a role with various permissions. -admin, -mod, -meme\n",
  access_level: 6,
  hidden: false,
  syntax: "!newrole -PERMISSION_LEVEL [#COLOR] rolename",
  execute(message, args) {
    let rolePerm = args[0];
    console.log(rolePerm);
    if (rolePerm in rolePerms) {
      if (
        access.has_permission.check_list(message, rolePerms[args[rolePerm]])
      ) {
        let roleData = rolePerms[rolePerm];
        let roleColor =
          args[1].startsWith("#") && args[1].length === 7 ? args[1] : "WHITE";
        let roleName = "";
        if (args[2] && args[0].startsWith("#")) {
          roleName =
            args[1].length === 7
              ? args.splice(2).join(" ")
              : args.splice(1).join(" ");
          roleColor = args[1].length === 7 ? args[1] : "WHITE";
        } else if (args[1]) {
          console.log(args[1]);
          roleName = args.splice(1).join(" ");
        } else {
          message.channel.send("no role name given. role creation failed.");
          return;
        }
        message.guild.roles
          .create({
            data: {
              name: roleName,
              color: roleColor,
              mentionable: roleData.mentionable,
            },
            reason: roleName,
          })
          .then((role) => {
            console.log(`Created new role with name ${role.name}`);

            let thePerms = new Discord.Permissions();
            for (let i = 0; i < roleData.permissions.length; ++i) {
              thePerms.add(roleData.permissions[i]);
            }
            for (let i = 0; i < roleData.restrictions.length; ++i) {
              let deny = roleData.restrictions[i];
              thePerms.remove(deny);
            }
            role.setPermissions(thePerms);
          });
      } else {
        message.channel.send(
          "you do not have permission to make roles in this server"
        );
      }
    } else {
      message.channel.send("role permission setting is not valid");
    }
  },
};
