const child_process = require('child_process');
const fs = require('fs');

const JSZip = require('jszip');

const WebpackConfig = require('./src/js/data/settingswebpack.js');
const settings = new WebpackConfig()

const settingsDir = `./src/js/data/settingswebpack.js`;
const gameControllerDir = `./src/js/app/components/gamecontroller.js`;

const keys = [
  'import TemplateGameController',  //0
  'import FacebookGameController',  //1
  'import AdColonyGameController',  //2
  'import UnityGameController',  //3
  'import IronSourceGameController',  //4
  'import MintegralController',  //5
  'import GoogleGameController',  //6
  'import GoogleGameController',  //7
  'import VungleGameController',  //8
  'import TikTokGameController',  //9
  'import UnityGameController',  //10
  'import UnityGameController',  //11
];

const names = [
  'Template',
  'Facebook',
  'AdColony',
  'Unity',
  'IronSource',
  'Mintegral',
  'Google-land',
  'Google-port',
  'Vungle',
  'TikTok',
  'Applovin',
  'Chartboost'
];

let currentIndex = 0;
runPlatformBuild();

function runPlatformBuild() {
  for (let j = 0; j < keys.length; j++) {
    readWriteSyncController(j, keys[currentIndex] !== keys[j]);
  }

  readWriteSyncSettings(currentIndex);

  child_process
    .exec('npm run build', { cwd: `./`, maxBuffer: 1024 * 4000 }, function (err, stdout, stderr) {
      if (err) {
        console.log(err);
      }
    })
    .on('exit', msg => {
      zipFiles(currentIndex, () => {
        const fill = '████████████████████████████████████████'.split('').slice(0, currentIndex + 1).join('');
        const empty = '.......................................'.split('').slice(0, keys.length - (currentIndex + 1)).join('');
        const progress = '|' + fill + empty + '|' + (100 / (keys.length) * (currentIndex + 1)).toFixed(1) + '% ';
        const str = progress + names[currentIndex] + ' ✅';
        console.log(str);

        if (currentIndex < keys.length - 1) {
          runPlatformBuild(++currentIndex);
        }
      });
    });
}

function readWriteSyncController(keyId, comment) {
  const data = fs.readFileSync(gameControllerDir, 'utf-8');
  let newData = data;

  const indexStr = keys[keyId];
  const indexStart = data.indexOf(indexStr);
  const commentPos = indexStart - 2;

  if (data[commentPos] !== '/' && comment) {
    newData = data.replace(keys[keyId], '// ' + keys[keyId]);
  } else if (data[commentPos] === '/' && !comment) {
    newData = data.replace('// ' + keys[keyId], keys[keyId]);
  }

  fs.writeFileSync(gameControllerDir, newData, 'utf-8');
}

function readWriteSyncSettings(newId) {
  const data = fs.readFileSync(settingsDir, 'utf-8');
  let newData = data.replace(/(indexCurrentAdvertisingPlatform: )\d+/gi, `indexCurrentAdvertisingPlatform: ` + newId);
  fs.writeFileSync(settingsDir, newData, 'utf-8');
}

function zipFiles(platformIndex, onFinish) {
  const buildPath = `./builds/${settings.getFolderName()}/${settings.getFileName(currentIndex)}`;
  const resultPath = `./builds/${settings.getFolderName()}/${settings.getZipName(currentIndex)}`;

  if (names[platformIndex].includes('Google') || names[platformIndex].includes('Mintegral')) {
    const playableData = fs.readFileSync(buildPath);
    zipDefault(resultPath, playableData, onFinish);
  }
  else if (names[platformIndex].includes('TikTok')) {
    const playableData = fs.readFileSync(buildPath);
    zipTikTok(buildPath, resultPath, playableData, onFinish);
  }
  else {
    onFinish();
  }
}

function zipDefault(resultPath, playableData, onFinish) {
  const zip = new JSZip();
  zip.file(settings.getFileName(currentIndex), playableData);

  zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(fs.createWriteStream(resultPath))
    .on('finish', function () {
      onFinish();
    });
}

function zipTikTok(buildPath, resultPath, playableData, onFinish) {
  const zip = new JSZip();
  zip.file(settings.getFileName(currentIndex), playableData);

  const config =
    `{
    "playable_orientation": 0,
    "playable_languages": ["en"]
  }`;
  zip.file('config.json', config);

  zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(fs.createWriteStream(resultPath))
    .on('finish', function () {
      fs.unlinkSync(buildPath);
      onFinish();
    });
}