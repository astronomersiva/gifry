const request = require('request');
const fs = require('fs');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      return resolve();
    }

    if (!fs.existsSync('tmp')){
      fs.mkdirSync('tmp');
    }

    let stream = request(url).pipe(fs.createWriteStream(dest));
    return stream.on('finish', () => { return resolve(); });
    stream.on('error', (error) => { return reject(error); });
  });
}

module.exports = download;
