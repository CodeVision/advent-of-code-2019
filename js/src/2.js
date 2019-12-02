const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);


const program = (memory) => {
  let pointer = 0;
  let opcode = memory[pointer];
  while (opcode != 99) {
    if (opcode == 1) {
      let value = memory[memory[pointer+1]] + memory[memory[pointer+2]];
      memory[memory[pointer+3]] = value;
    } else if (opcode == 2) {
      let value = memory[memory[pointer+1]] * memory[memory[pointer+2]];
      memory[memory[pointer+3]] = value;
    }

    pointer += 4;
    opcode = memory[pointer];
  }

  return memory;
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
  const input = process.argv[2];
  const part = process.argv[3];

  const originalMemory = await readInput(input);
  if (part == 1) {
    let noun = 12;
    let verb = 2;

    const memory = [...originalMemory];
    memory[1] = noun;
    memory[2] = verb;
    let result = program(memory);

    console.log(result);
    console.log(result[0]);
  } else {
    const goal = 19690720;

    let noun = 0;
    let verb = 0;
    outer:
      for (noun = 0; noun < 99; noun += 1) {
        for (verb = 0; verb < 99; verb += 1) {
          let memory = [...originalMemory];

          memory[1] = noun;
          memory[2] = verb;

          let output = program(memory);

          if (output[0] == goal)
            break outer;
        }
      }

    let answer = 100 * noun + verb;
    console.log(answer);
  }
})();
