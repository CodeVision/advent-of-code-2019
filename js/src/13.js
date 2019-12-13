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

const run = (memory, grid, moves) => {
  const computer = intcode.run(memory, []);

  let x, y, tile, score = 0;
  let result = { done: false };
  while (result && !result.done) {
    result = computer.next(moves.shift()).value;
    if (!result)
      break;
    x = result.output;
    result = computer.next(moves.shift()).value;
    y = result.output;

    result = computer.next(moves.shift()).value;

    if (x === -1 && y === 0) {
      score = result.output;
      console.log(score);
    } else {
      tile = result.output;
      paint(grid, { x: x, y: y }, tile);
    }

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
  }
})();
