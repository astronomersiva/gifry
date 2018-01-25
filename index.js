const { execSync } = require('child_process');

const giphy = require('./lib/giphy');
const asyncForEach = require('./lib/asyncForEach');
const download = require('./lib/download');

const getGifsForStory = async(storyLines) => {
  let gifArray = [];

  await asyncForEach(storyLines, async(scene) => {
    const gifImages = await giphy(scene);
    let gifOriginal = gifImages.images.original;
    let { width, height, url } = gifOriginal;
    gifArray.push({ width, height, url });
  });

  return gifArray;
};

const downloadGifs = async(storyLines) => {
  let translatedGifs = await getGifsForStory(storyLines);
  let gifs = [];
  let size = {};
  await asyncForEach(translatedGifs, async(gif) => {
    let fileName = gif.url.split('/')[4];
    gif.path = `tmp/${fileName}.gif`;
    gifs.push(gif);
    await download(gif, gif.path);
    if (!size.width || (size.width < gif.width)) {
      size.width = gif.width;
    }

    if (!size.height || (size.height < gif.height)) {
      size.height = gif.height;
    }
  });

  return { gifs, size };
};

const storyLines = ['story', 'here'];

downloadGifs(storyLines).then(({ gifs, size }) => {
  gifs.forEach((gif) => {
    execSync(`gifsicle ${gif.path} --resize-fit ${size.width}x${size.height} -o ${gif.path}`, { stdio: [0, 1, 2] });
  });

  let gifPaths = '';
  gifs.forEach((gif) => { gifPaths = `${gifPaths} ${gif.path}` });
  execSync(`gifsicle --merge ${gifPaths} -o output.gif`, { stdio: [0, 1, 2] });
}).catch((err) => {
  throw err;
});
