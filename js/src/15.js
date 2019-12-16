'use strict';

/* eslint-disable no-console */
const intcode = require('./lib/intcode');


const createGrid = (width, height) => {
  const grid = [];
  for (let r = 0; r < height; r++) {
    let row = [];
    for (let c = 0; c < width; c++) {
      row.push(' ');
    }
    grid.push(row);
  }
  return grid;
};

const paint = (grid, loc, statusId) => {
  let status = ['#', '.', '*'][statusId];
  grid[loc.y][loc.x] = status;
};

const printGrid = (grid, pos) => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (row == pos.y && col == pos.x) {
        process.stdout.write('D');
      } else if (row == grid.length / 2 && col == grid[0].length / 2) {
        process.stdout.write('S');
      } else {
        process.stdout.write(grid[row][col]);
      }
    }
    console.log();
  }
};

const getPos = (pos, move) => {
  if (move === 1) {
    return { x: pos.x, y: pos.y - 1 };
  } else if (move === 2) {
    return { x: pos.x, y: pos.y + 1 };
  } else if (move === 3) {
    return { x: pos.x - 1, y: pos.y };
  } else {
    return { x: pos.x + 1, y: pos.y };
  }
};

const getStatus = (grid, pos) => {
  return grid[pos.y][pos.x];
};

const printPos = (pos) => {
  return `(${pos.x}, ${pos.y})`;
};

const getMove = (grid, pos) => {
  let move = Math.floor(Math.random() * 4) + 1;
  for (let direction of [3, 1, 2, 4]) {
    if (getStatus(grid, getPos(pos, direction)) === ' ')  {
      move = direction;
      break;
    }
  }

  while (getStatus(grid, getPos(pos, move)) === '#') {
    move = Math.floor(Math.random() * 4) + 1;
  }

  return move;
};

const gridContainsUnexplored = (grid) => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      let char = grid[row][col];
      if (char === '.') {
        for (let dir of [1, 2, 3, 4]) {
          if (getStatus(grid, getPos({ y: row, x: col }, dir)) === ' ') {
            return true;
          }
        }
      }
    }
  }
  return false;
};

const run = (memory, grid) => {
  const computer = new intcode.IntCodeComputer(memory);

  let move = 1;
  let pos = { x: grid[0].length / 2, y: grid.length / 2 };
  let result = computer.run(move);
  while (result !== 2) {
    // console.log(`pos: ${printPos(pos)}, move: ${move} - result: ${result}`);
    paint(grid, getPos(pos, move), result);
    if (result != 0) {
      pos = getPos(pos, move);
    }

    // printGrid(grid, pos);
    move = getMove(grid, pos);
    result = computer.run(move);
  }
  paint(grid, getPos(pos, move), result);

  return pos;
};


(async () => {
  // main
  const inputFile = process.argv[2];
  const part = process.argv[3];

  const originalMemory = await intcode.readInput(inputFile);
  if (part == 1) {
    console.log('Part 1');
    const grid = createGrid(60, 60);
    let pos = run([...originalMemory], grid);
    while (gridContainsUnexplored(grid)) {
      pos = run([...originalMemory], grid);
      printGrid(grid, pos);
    }
  } else {
    console.log('Part 2');
  }
})();