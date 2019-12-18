'use strict';

/* eslint-disable no-console */
const intcode = require('./lib/intcode');


const run = (memory) => {
  const computer = new intcode.IntCodeComputer(memory);

  let grid = [];
  let row = [];
  let result = computer.run();
  while (result !== undefined) {
    if (result === 10) {
      grid.push(row);
      row = [];
    } else {
      row.push(String.fromCharCode(result));
    }

    result = computer.run();
  }

  return grid;
};

const printGrid = (grid) => {
  for (let row of grid) {
    console.log(row.join(''));
  }
};

const getInsersections = (grid) => {
  const intersections = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      let output = grid[row][col];
      if (output === '#') {
        if (grid[row][col + 1] === '#' &&
            grid[row][col - 1] === '#' &&
            grid[row + 1][col] === '#' &&
            grid[row - 1][col] === '#') {
          intersections.push({ y: row, x: col });
        }
      }
    }
  }
  return intersections;
};

const encode = (sequence) => {
  let result = [];
  for (let i = 0; i < sequence.length; i++) {
    let s = sequence[i];
    if (s.length == 1) {
      result.push(s.charCodeAt());
    } else {
      for (let c of s.split('')) {
        result.push(c.charCodeAt());
      }
    }

    if (i !== sequence.length - 1) {
      result.push(','.charCodeAt());
    }
  }
  result.push(10);

  return result;
};

const vacuum = (memory, routine, funcs) => {
  const computer = new intcode.IntCodeComputer(memory);

  let inputs = routine.concat(funcs.flat()).concat([110, 10]);
  for (let input of inputs) {
    computer.addInput(input);
  }
  let result = null;
  while (result !== undefined) {
    result = computer.run();

    if (result < 128) {
      process.stdout.write(String.fromCharCode(result));
    } else {
      return result;
    }
  }

  return result;
};

(async () => {
  // main
  const inputFile = process.argv[2];
  const part = process.argv[3];

  const originalMemory = await intcode.readInput(inputFile);
  if (part == 1) {
    console.log('Part 1');
    const grid = run(originalMemory);
    printGrid(grid);

    const intersections = getInsersections(grid);
    console.log(JSON.stringify(intersections, null, 2));
    console.log(intersections.reduce((sum, i) => sum + i.x * i.y, 0));
  } else {
    console.log('Part 2');

    const routine = encode("ABBCCABBCA".split(''));
    const funcs = [
      ['R', '4', 'R', '12', 'R', '10', 'L', '12'],
      ['L', '12', 'R', '4', 'R', '12'],
      ['L', '12', 'L', '8', 'R', '10']
    ].map(encode);

    const memory = [...originalMemory];
    memory[0] = 2;
    const result = vacuum(memory, routine, funcs);
    console.log(result);
  }
})();
