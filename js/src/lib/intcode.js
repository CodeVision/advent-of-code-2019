/* eslint-disable no-console */
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const getValue = (memory, pointer, mode) => {
  if (!mode || mode === 0) {
    return memory[memory[pointer]];
  } else {
    return memory[pointer];
  }
};

function * run(memory, inputs) {
  let inputIndex = 0;
  let pointer = 0;
  let opcode = memory[pointer] % 100;
  let modes = getModes(memory[pointer]);
  while (opcode != 99) {
    if (opcode == 1) {
      let value = getValue(memory, pointer + 1, modes[0]) + getValue(memory, pointer + 2, modes[1]);
      memory[memory[pointer + 3]] = value;

      pointer += 4;
    } else if (opcode == 2) {
      let value = getValue(memory, pointer + 1, modes[0]) * getValue(memory, pointer + 2, modes[1]);
      memory[memory[pointer + 3]] = value;

      pointer += 4;
    } else if (opcode == 3) {
      memory[memory[pointer + 1]] = inputs[inputIndex++];

      pointer += 2;
    } else if (opcode == 4) {
      let output = getValue(memory, pointer + 1, modes[0]);
      let newInput = yield { memory, output };
      inputs.push(newInput);

      pointer += 2;
    } else if (opcode == 5) {
      if (getValue(memory, pointer + 1, modes[0]) !== 0) {
        pointer = getValue(memory, pointer + 2, modes[1]);
      } else {
        pointer += 3;
      }
    } else if (opcode == 6) {
      if (getValue(memory, pointer + 1, modes[0]) === 0) {
        pointer = getValue(memory, pointer + 2, modes[1]);
      } else {
        pointer += 3;
      }
    } else if (opcode == 7) {
      if (getValue(memory, pointer + 1, modes[0]) < getValue(memory, pointer + 2, modes[1])) {
        memory[memory[pointer + 3]] = 1;
      } else {
        memory[memory[pointer + 3]] = 0;
      }

      pointer += 4;
    } else if (opcode == 8) {
      if (getValue(memory, pointer + 1, modes[0]) === getValue(memory, pointer + 2, modes[1])) {
        memory[memory[pointer + 3]] = 1;
      } else {
        memory[memory[pointer + 3]] = 0;
      }

      pointer += 4;
    }

    opcode = memory[pointer] % 100;
    modes = getModes(memory[pointer]);

    // console.log(`opcode: ${opcode}`);
    // console.log(`modes: ${modes}`);
    // console.log(memory);
  }
};

const getModes = (value) => {
  let modesValue = (value - value % 100) / 100;
  let modes = [];
  while (modesValue >= 1) {
    modes.push(modesValue % 10);

    modesValue /= 10;
  }

  return modes;
};

const readInput = async (input) => {
  return readFile(input, 'utf8').then(data => {
    return data.trim().split(',');
  }).then(stringArray => {
    return stringArray.map(Number);
  });
};

module.exports = {
  readInput,
  run,
};
