const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const readInput = async (input) => {
  return readFile(input, 'utf8').then(data => {
    return data.trim().split('-');
  });
};

const passwords = (min, max, test) => {
  let matches = [];
  for (let i = min; i <= max; i++) {
    if (test(i))
      matches.push(i);
  }
  return matches;
};

const increasing = (input) => {
  let last = input % 10;
  let num = Math.floor(input / 10);
  while (num > 0) {
    let cur = num % 10;
    if (cur > last)
      return false;

    last = cur;
    num = Math.floor(num / 10);
  }

  return true;
};

const adjacentDigits = (input) => {
  let last = input % 10;
  let num = Math.floor(input / 10);
  while (num > 0) {
    let cur = num % 10;

    if (cur == last)
      return true;

    last = cur;
    num = Math.floor(num / 10);
  }

  return false;
};

const adjacentDigitsNoGroup = (input) => {
  let numAdjacent = 1;

  let last = input % 10;
  let num = Math.floor(input / 10);
  while (num > 0) {
    let cur = num % 10;
    if (cur == last) {
      numAdjacent += 1;
    } else {
      if (numAdjacent == 2)
        return true;

      numAdjacent = 1;
    }

    last = cur;
    num = Math.floor(num / 10);
  }

  if (numAdjacent == 2)
    return true;

  return false;
};


(async () => {
  // main
  const input = process.argv[2];
  const part = process.argv[3];

  const range = await readInput(input);
  const min = Number(range[0]);
  const max = Number(range[1]);

  if (part == 1) {
    let test = (i => increasing(i) && adjacentDigits(i));
    let validPasswords = passwords(min, max, test);

    console.log(validPasswords.length);
  } else {
    // todo
    let test = (i => increasing(i) && adjacentDigitsNoGroup(i));
    let validPasswords = passwords(min, max, test);
    console.log(validPasswords.length);
  }
})();
