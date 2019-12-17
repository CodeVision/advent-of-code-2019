const fs = require('fs');
const util = require('util');

/* eslint-disable no-console */

const readFile = util.promisify(fs.readFile);

const readInput = async (input) => {
  return readFile(input, 'utf8')
    .then(data => data.trim().split(''))
    .then(line => line.map(Number));
};

const BASE_PATTERN = [0, 1, 0, -1];
const getPattern = (position, length) => {
  let pattern = [];
  for (let i = 0; i <= length; i++) {
    pattern.push(BASE_PATTERN[Math.floor(i / position) % BASE_PATTERN.length]);
  }

  // console.log(pattern.length);

  return pattern.slice(1, length + 1);
};

const transform = (input) => {
  let result = [];
  for (let i = 0; i < input.length; i++) {
    let pattern = getPattern(i + 1, input.length);

    let output = 0;
    for (let ii = 0; ii < input.length; ii++) {
      output += input[ii] * pattern[ii];
    }
    result.push(Math.abs(output) % 10);
  }

  return result;
};

const transformOffset = (input, offset) => {
  let result = [];
  result[input.length - 1] = input[input.length - 1];
  for (let i = input.length - 2; i >= offset; i--) {
    result[i] = (input[i] + result[i + 1]) % 10;
  }
  return result;
};

const getOffset = (list) => {
  let offset = 0;
  for (let i = 0; i < 7; i++) {
    offset += list[i] * Math.pow(10, 6 - i);
  }
  return offset;
};

(async () => {
  // main
  const input = process.argv[2];
  const part = process.argv[3];

  const list = await readInput(input);
  if (part == 1) {
    const numReps = Number(process.argv[4]);

    console.log('Part 1');
    console.log(list);
    let output = list;
    for (let i = 0; i < numReps; i++) {
      output = transform(output);
      console.log(output);
    }
    console.log(output);
  } else if (part == 2) {
    console.log('Part 2');

    const numReps = Number(process.argv[4]);
    let offset;
    if (process.argv[5]) {
      offset = Number(process.argv[5]);
    } else {
      offset = getOffset(list);
    }

    let finalList = [];
    for (let i = 0; i < 10000; i++) {
      finalList.push(...list);
    }

    let output = finalList;
    for (let i = 0; i < numReps; i++) {
      output = transformOffset(output, offset);
    }

    let digits = [];
    for (let i = 0; i < 8; i++) {
      digits.push(output[i + offset]);
    }
    console.log(digits.join());
  } else {
    const pos = Number(process.argv[4]);
    console.log(getPattern(pos, 8));
  }
})();
