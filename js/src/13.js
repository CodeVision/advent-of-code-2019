'use strict';

/* eslint-disable no-console */
const intcode = require('./lib/intcode');


const createGrid = (width, height) => {
  const grid = [];
  for (let row = 0; row < height; row++) {
    grid.push([]);
  }
  return grid;
};

const paint = (grid, loc, tileId) => {
  let tile = [' ', '|', '#', '_', '*'][tileId];
  grid[loc.y][loc.x] = tile;
};

const printGrid = (grid) => {
  for (let row = 0; row < grid.length; row++) {
    let line = grid[row].map(c => c === undefined ? '' : c);

    console.log(line.join(''));
  }
};

const run = (memory, grid, moves = []) => {
  const computer = new intcode.IntCodeComputer(memory);

  let result = computer.run(moves.shift());
  let x, y, tile, score = 0;
  while (result !== undefined) {
    x = result;
    result = computer.run(moves.shift());
    y = result;

    result = computer.run(moves.shift());

    if (x === -1 && y === 0) {
      score = result;
    } else {
      tile = result;
      paint(grid, { x: x, y: y }, tile);
    }

    result = computer.run(moves.shift());

  }

  return score;
};

const numBlocks = (grid) => {
  return grid.flat().reduce((sum, i) => i === '#' ? sum + 1 : sum, 0);
};

(async () => {
  // main
  const inputFile = process.argv[2];
  const part = process.argv[3];

  const originalMemory = await intcode.readInput(inputFile);
  if (part == 1) {
    console.log('Part 1');
    const grid = createGrid(25, 25);
    run([...originalMemory], grid);
    printGrid(grid);

    console.log(numBlocks(grid));

  } else {
    console.log('Part 2');
    const grid = createGrid(22, 22);
    let memory = [...originalMemory];
    memory[0] = 2;
    let possibleMoves = [0, -1, 1];
    let moves = [];

    let bestScore = 0;
    let score = 0;
    do {

      for (let m of possibleMoves) {
        score = run(memory, grid, moves.concat(m));

        if (score > bestScore) {
          bestScore = score;
          moves.push(m);
          break;
        }
      }
      printGrid(grid);
    } while (numBlocks(grid) > 0);
    console.log(score);
  }
})();
