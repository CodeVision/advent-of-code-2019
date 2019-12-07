'use strict';

/* eslint-disable no-console */
const intcode = require('./lib/intcode');

const permutations = (input) => {
  let result = [input.slice()];
  let c = new Array(input.length).fill(0);
  let i = 1, k, p;

  while (i < input.length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = input[i];
      input[i] = input[k];
      input[k] = p;
      ++c[i];
      i = 1;
      result.push(input.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
};

(async () => {
  // main
  const inputFile = process.argv[2];
  const part = process.argv[3];
  const input = process.argv[4];

  const originalMemory = await intcode.readInput(inputFile);
  if (part == 1) {
    const perms = permutations([0, 1, 2, 3, 4]);
    let finalOutput = 0;
    let bestPerm;
    for (let perm of perms) {
      console.log(perm);
      let input = 0;
      let amplifiers = [];
      for (let i = 0; i < perm.length; i++) {
        let amplifier = intcode.run([...originalMemory], [perm[i], input]);
        let { memory, output } = amplifier.next(input).value;
        input = output;
        amplifiers.push(amplifier);
      }
      for (let amplifier of amplifiers) {
        let result = amplifier.next(input);
        if (result.done)
          continue;

        let { memory, output } = result.value;
        input = output;

        console.log(memory);
        console.log(output);
      }

      if (input > finalOutput) {
        finalOutput = input;
        bestPerm = perm;
      }
    }

    console.log(`finalOutput: ${finalOutput} with perm: ${bestPerm}`);

    // console.log(result);
  } else {
    const perms = permutations([5, 6, 7, 8, 9]);
    let finalOutput = 0;
    let bestPerm;
    for (let perm of perms) {
      console.log(perm);
      let input = 0;
      let amplifiers = [];
      for (let i = 0; i < perm.length; i++) {
        let amplifier = intcode.run([...originalMemory], [perm[i], input]);
        let { memory, output } = amplifier.next(input).value;
        input = output;
        amplifiers.push(amplifier);
      }

      let done = false;
      while (!done) {
        for (let amplifier of amplifiers) {
          let result = amplifier.next(input);

          if (result.done) {
            done = true;
          } else {
            let { memory, output } = result.value;
            input = output;

            console.log(memory);
            console.log(output);

            if (input > finalOutput) {
              finalOutput = input;
              bestPerm = perm;
            }
          }
        }
      }
    }

    console.log(`finalOutput: ${finalOutput} with perm: ${bestPerm}`);
  }
})();
