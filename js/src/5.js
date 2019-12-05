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

const program = (memory, input = 0) => {
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
      memory[memory[pointer + 1]] = input;

      pointer += 2;
    } else if (opcode == 4) {
      let output = getValue(memory, pointer + 1, modes[0]);
      console.log(output);

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

  return memory;
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

(async () => {
  // main
  const inputFile = process.argv[2];
  const part = process.argv[3];
  const input = process.argv[4];

  const originalMemory = await readInput(inputFile);
  if (part == 1) {
    const memory = [...originalMemory];
    let result = program(memory, 1);

    console.log(result);
  } else {
    const memory = [...originalMemory];
    let result = program(memory, Number(input));

    console.log(result);
  }
})();
