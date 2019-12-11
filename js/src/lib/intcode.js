/* eslint-disable no-console */
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const getValue = (memory, pointer, mode, rel_base) => {
  return memory[getPointer(memory, pointer, mode, rel_base)] || 0;
};

const getPointer = (memory, pointer, mode, rel_base) => {
  if (!mode || mode === 0) {
    return memory[pointer];
  } else if (mode === 1) {
    return pointer;
  } else if (mode === 2) {
    return memory[pointer] + rel_base;
  }
};

function * run(memory, inputs) {
  let inputIndex = 0;
  let rel_base = 0;
  let pointer = 0;
  let opcode = memory[pointer] % 100;
  let modes = getModes(memory[pointer]);

  while (opcode != 99) {
    if (opcode == 1) {
      let value = getValue(memory, pointer + 1, modes[0], rel_base) + getValue(memory, pointer + 2, modes[1], rel_base);
      memory[getPointer(memory, pointer + 3, modes[2], rel_base)] = value;

      pointer += 4;
    } else if (opcode == 2) {
      let value1 = getValue(memory, pointer + 1, modes[0], rel_base);
      let value2 = getValue(memory, pointer + 2, modes[1], rel_base);
      memory[getPointer(memory, pointer + 3, modes[2], rel_base)] = value1 * value2;

      pointer += 4;
    } else if (opcode == 3) {
      memory[getPointer(memory, pointer + 1, modes[0], rel_base)] = inputs[inputIndex++];

      pointer += 2;
    } else if (opcode == 4) {
      let output = getValue(memory, pointer + 1, modes[0], rel_base);
      // console.log(output);
      let newInput = yield { memory, output };
      if (newInput !== undefined)
        inputs.push(newInput);

      pointer += 2;
    } else if (opcode == 5) {
      if (getValue(memory, pointer + 1, modes[0], rel_base) !== 0) {
        pointer = getValue(memory, pointer + 2, modes[1], rel_base);
      } else {
        pointer += 3;
      }
    } else if (opcode == 6) {
      if (getValue(memory, pointer + 1, modes[0], rel_base) === 0) {
        pointer = getValue(memory, pointer + 2, modes[1], rel_base);
      } else {
        pointer += 3;
      }
    } else if (opcode == 7) {
      if (getValue(memory, pointer + 1, modes[0], rel_base) < getValue(memory, pointer + 2, modes[1], rel_base)) {
        memory[getPointer(memory, pointer + 3, modes[2], rel_base)] = 1;
      } else {
        memory[getPointer(memory, pointer + 3, modes[2], rel_base)] = 0;
      }

      pointer += 4;
    } else if (opcode == 8) {
      if (getValue(memory, pointer + 1, modes[0], rel_base) === getValue(memory, pointer + 2, modes[1], rel_base)) {
        memory[getPointer(memory, pointer + 3, modes[2], rel_base)] = 1;
      } else {
        memory[getPointer(memory, pointer + 3, modes[2], rel_base)] = 0;
      }

      pointer += 4;
    } else if (opcode == 9) {
      rel_base += getValue(memory, pointer + 1, modes[0], rel_base);

      pointer += 2;
    }

    opcode = memory[pointer] % 100;
    modes = getModes(memory[pointer]);

    // console.log(`opcode: ${opcode}, modes: ${modes}, rel_base: ${rel_base}`);
    // console.log(memory);
  }
}

const getModes = (value) => {
  let modesValue = (value - value % 100) / 100;
  let modes = [];
  while (modesValue >= 1) {
    let mode = modesValue % 10;
    modes.push(mode);

    modesValue = (modesValue - mode) / 10;
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
