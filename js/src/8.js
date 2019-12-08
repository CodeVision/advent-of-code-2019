const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const readInput = async (input) => {
  return readFile(input, 'utf8').then(data => {
    return data.trim().split('');
  });
};

const parseImage = (data, width, height) => {
  const image = [];
  const size = width * height;

  let layer = [];
  for (let pos = 0; pos < data.length; pos++) {
    if (layer.length == size) {
      image.push(layer);

      layer = [];
    }

    layer.push(data[pos]);
  }

  if (layer.length == size) {
    image.push(layer);
  }
  return image;
};

const countDigits = (layer, digit) => {
  let count = 0;
  for (let d of layer) {
    if (d === digit)
      count++;
  }

  return count;
};

const findLayer = (image, digit) => {
  let result = {};
  for (let layer of image) {
    let count = countDigits(layer, digit);
    if (!result.count || count < result.count) {
      result.layer = layer;
      result.count = count;
    }
  }
  return result;
};

const decode = (image, size) => {
  const finalImage = [];
  pixelLoop:
  for (let i = 0; i < size; i++) {
    for (let layer of image) {
      let pixel = layer[i];
      if (pixel == '0' || pixel == '1') {
        finalImage.push(pixel);
        continue pixelLoop;
      }
    }
  }
  return finalImage;
};

const printImage = (image, width) => {
  let result = [];
  for (let i = 0; i < image.length; i++) {
    if (i % width === 0) {
      result.push('\n');
    }

    if (image[i] == '1') {
      result.push(image[i]);
    } else {
      result.push(' ');
    }
  }

  console.log(result.join(""));
};

(async () => {
  // main
  const input = process.argv[2];
  const part = process.argv[3];
  const [width, height] = process.argv[4].split(':');

  const rawImage = await readInput(input);
  const image = parseImage(rawImage, width, height);
  if (part == 1) {
    const { layer } = findLayer(image, '0');
    const result = countDigits(layer, '1') * countDigits(layer, '2');
    console.log(result);
  } else {
    const finalImage = decode(image, width * height);
    printImage(finalImage, width);
  }
})();
