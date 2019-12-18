/* eslint-disable no-console */
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);


class IntCodeComputer {
  constructor(memory) {
    this.memory = memory;
    this.pointer = 0;
    this.relBase = 0;
    this.inputs = [];
    this.inputIndex = 0;
  }

  getValue(mode) {
    return this.memory[this.getPointer(mode)] || 0;
  }

  getPointer(mode) {
    this.pointer++;
    if (!mode || mode === 0) {
      return this.memory[this.pointer];
    } else if (mode === 1) {
      return this.pointer;
    } else if (mode === 2) {
      return this.memory[this.pointer] + this.relBase;
    }
  }

  addInput(input) {
    this.inputs.push(input);
  }

  getInput() {
    return this.inputs[this.inputIndex++];
  }

  run() {
    let opcode = this.memory[this.pointer] % 100;
    let modes = this.getModes(this.pointer);

    while (opcode != 99) {
      if (opcode == 1) {
        let value = this.getValue(modes[0]) + this.getValue(modes[1]);
        this.memory[this.getPointer(modes[2])] = value;

        this.pointer += 1;
      } else if (opcode == 2) {
        let value1 = this.getValue(modes[0]);
        let value2 = this.getValue(modes[1]);
        this.memory[this.getPointer(modes[2])] = value1 * value2;

        this.pointer += 1;
      } else if (opcode == 3) {
        this.memory[this.getPointer(modes[0])] = this.getInput();

        this.pointer += 1;
      } else if (opcode == 4) {
        let output = this.getValue(modes[0]);

        this.pointer += 1;

        return output;
      } else if (opcode == 5) {
        if (this.getValue(modes[0]) !== 0) {
          this.pointer = this.getValue(modes[1]);
        } else {
          this.pointer += 2;
        }
      } else if (opcode == 6) {
        if (this.getValue(modes[0]) === 0) {
          this.pointer = this.getValue(modes[1]);
        } else {
          this.pointer += 2;
        }
      } else if (opcode == 7) {
        if (this.getValue(modes[0]) < this.getValue(modes[1])) {
          this.memory[this.getPointer(modes[2])] = 1;
        } else {
          this.memory[this.getPointer(modes[2])] = 0;
        }

        this.pointer += 1;
      } else if (opcode == 8) {
        if (this.getValue(modes[0]) === this.getValue(modes[1])) {
          this.memory[this.getPointer(modes[2])] = 1;
        } else {
          this.memory[this.getPointer(modes[2])] = 0;
        }

        this.pointer += 1;
      } else if (opcode == 9) {
        this.relBase += this.getValue(modes[0]);

        this.pointer += 1;
      }

      opcode = this.memory[this.pointer] % 100;
      modes = this.getModes(this.pointer);

      // console.log(`opcode: ${opcode}, modes: ${modes}, relBase: ${this.relBase}`);
      // console.log(this.memory);
    }
  }

  getModes(pointer) {
    let value = this.memory[pointer];
    let modesValue = (value - value % 100) / 100;
    let modes = [];
    while (modesValue >= 1) {
      let mode = modesValue % 10;
      modes.push(mode);

      modesValue = (modesValue - mode) / 10;
    }

    return modes;
  }
}

const readInput = async (input) => {
  return readFile(input, 'utf8').then(data => {
    return data.trim().split(',');
  }).then(stringArray => {
    return stringArray.map(Number);
  });
};

module.exports = {
  readInput,
  IntCodeComputer,
};
