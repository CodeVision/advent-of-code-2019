
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
  }
})();
