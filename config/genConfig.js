const fs = require('fs');
const readline = require('readline');
const configPath = "../config/config.json";
const { memeFolder, memeLog } = require("./filepaths.js")
const configVars = ["prefix", "avatar", "token"];

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function gener() {
    
    if (!fs.existsSync("../memes")) {
        console.log("generating meme folder and json file");
        fs.mkdirSync("../memes");
    }

    if (!fs.existsSync(memeLog)) {
        fs.appendFileSync(memeLog, `{}`, function (err) {
            if (err) throw err;
        });
    }

    if (!fs.existsSync(configPath)) {
        let config = {};
        console.log("it seems like you don't have a config file. ");
        r1.question("would you like to generate one? (y/n): ", ans => {
            if (ans.toLowerCase().trim() === "y") {
                for (let v in configVars) {}
                    r1.question(`${v}: `, ans => {
                        config[v] = ans.trim(); r1.close()})
            } else {
                console.log("no config file present, ending program");
                process.exit(1);
            }
            saveConfig();
            r1.close();
        })
        function saveConfig() {
            config = {prod: config};
            let configJSON = JSON.parse(config);
            fs.writeFileSync(memeLogFile, JSON.stringify(memefile), function writeJSON(err) {
                if (err) return console.log(err);
                console.log("successfully wrote config.json");
            })
        }
        
    }
}

gener();
