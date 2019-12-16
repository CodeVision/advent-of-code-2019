'use strict';

/* eslint-disable no-console */
const intcode = require('./lib/intcode');


(async () => {
  // main
  const inputFile = process.argv[2];
  const part = process.argv[3];
  const input = Number(process.argv[4]);

  const originalMemory = await intcode.readInput(inputFile);
  const computer = new intcode.IntCodeComputer([...originalMemory]);
  if (part == 1 || part == 2) {
    const output = [];
    let result = computer.run(input);
    while (result !== undefined) {
      output.push(result);
      result = computer.run();
    }
    console.log(output);
  }
})();
