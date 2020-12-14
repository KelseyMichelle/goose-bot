const fs = require("fs");
const prompt = require("prompt");
const configPath = "./config/config.json";
const { memeFolder, memeLog } = require("./config/filepaths.js");
const configVars = ["prefix", "avatar", "token"];

function gener() {
  if (!fs.existsSync("./memes")) {
    console.log("generating meme folder and json file");
    fs.mkdirSync("./memes");
  }

  if (!fs.existsSync(memeLog)) {
    fs.appendFileSync(memeLog, `{}`, function (err) {
      if (err) throw err;
    });
  }

  if (!fs.existsSync(configPath)) {
    let config = {};
    prompt.start();
    console.log("\nit seems like you don't have a config file. ");
    console.log("would you like to generate a new one? (y/n)");
    prompt.get("y_or_n", (err, ans) => {
      if (err) {
        return console.error(err);
      }
      if (ans.y_or_n.toLowerCase().trim() == "y") {
        prompt.get(configVars, (err, result) => {
          config.prefix = result.prefix;
          config.avatar = result.avatar;
          config.token = result.token;
          saveConfig();
        });
      } else {
        console.log("no config file present, ending program");
        process.exit(1);
      }
    });
    function saveConfig() {
      config = { config: { prod: config } };
      fs.appendFileSync(
        configPath,
        JSON.stringify(config),
        function writeJSON(err) {
          if (err) return console.log(err);
          console.log("successfully wrote config.json");
        }
      );
    }
  }
}

gener();
