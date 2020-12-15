const { fstat } = require('fs');
const oldMeme = require('./memes/memes.json');
const oldArchive = require('./archive/archive.json');
const path = require('path');
let newMConfig = {};
let newAConfig = {};

let memeGKeys = Object.keys(oldMeme);
let archiveGKeys = Object.keys(oldArchive);
console.log(memeGKeys);
console.log(
  memeGKeys.map((x) =>
    Object.keys(oldMeme[x]).map((y) =>
      oldMeme[x][y].map((z) => path.basename(z))
    )
  )
);

for (let x of memeGKeys) {
  for (let y of Object.keys(oldMeme[x])) {
    for (let z of y) {
      newMConfig[x][y] = z;
    }
  }
}
console.log(memeGKeys.map((x) => memeGKeys[x]));

// for (let key of memeKeys) {
// //fs.mkdirSync('./images/meme/' + key);

// for (let topic of Object.keys(oldMeme[key])) {
// newMConfig[topic] = newMConfig[topic].map((x) => path.basename(x));
// }
// }
// for (let key of archiveKeys) {
// //fs.mkdirSync('./images/archive/' + key);
// newMConfig.push(oldArchive[key]);
// for (let topic of Object.keys(newAConfig)) {
// console.log(newAConfig[topic]);
// newAConfig[topic] = path.basename(newAConfig[topic]);
// }
// }
