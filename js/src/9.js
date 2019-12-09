'use strict';

/* eslint-disable no-console */
const intcode = require('./lib/intcode');


(async () => {
  // main
  const inputFile = process.argv[2];
  const part = process.argv[3];
  const input = Number(process.argv[4]);

  const originalMemory = await intcode.readInput(inputFile);
  if (part == 1) {
    const computer = intcode.run([...originalMemory], [input]);

    const output = [];
    let result = computer.next().value;
    while (result && !result.done) {
      output.push(result.output);
      result = computer.next().value;
    }
    console.log(output);

  } else {
    const computer = intcode.run([...originalMemory], [input]);

    const output = [];
    let result = computer.next().value;
    while (result && !result.done) {
      output.push(result.output);
      result = computer.next().value;
    }
    console.log(output);
  }
})();
