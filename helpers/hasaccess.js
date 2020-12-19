let permissions = {
  0: [],
  1: ['MANAGE_MESSAGES'],
  2: ['KICK_MEMBERS'],
  3: ['BAN_MEMBERS'],
  4: ['MOVE_MEMBERS'],
  5: ['MANAGE_NICKNAMES'],
  6: ['MANAGE_ROLES'],
  7: ['ADMINISTRATOR'],
};

function evalAccess(message, level) {
  if (
    message.guild.ownerID === message.author.id ||
    message.member.hasPermission('ADMINISTRATOR')
  )
    return true;
  let can_do = false;
  console.log(level);
  if (permissions[level].length == 0) {
    return true;
  }
  for (let i = 0; i < permissions[level].length; ++i) {
    let perm = permissions[level][i];
    console.log(permissions[level]);
    console.log(perm);
    if (message.member.hasPermission(perm)) {
      console.log(message.member.permissions);
      can_do = true;
    } else {
      console.log(message.member.permissions);
      return false;
    }
  }
  return can_do;
}
function evalPerms(message, perms) {
  if (
    message.guild.ownerID === message.author.id ||
    message.member.hasPermission('ADMINISTRATOR')
  )
    return true;
  let can_do = false;
  if (permissions[level].length == 0) {
    return true;
  }
  for (let i = 0; i < perms.length; ++i) {
    let perm = perms[i];
    if (message.member.hasPermission(perm)) {
      can_do = true;
    } else {
      return false;
    }
  }
  return can_do;
}
module.exports = {
  has_permission: { check_tier: evalAccess, check_list: evalPerms },
};
