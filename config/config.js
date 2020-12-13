const { config }  = require("../config/config.json");

module.exports = {
    "prefix" : config[process.env.NODE_ENV.trim()]["prefix"],
    "token" : config[process.env.NODE_ENV.trim()]["token"],
    "avatar": config[process.env.NODE_ENV.trim()]["avatar"]
}