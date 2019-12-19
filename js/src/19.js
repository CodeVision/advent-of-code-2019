'use strict';

/* eslint-disable no-console */
const intcode = require('./lib/intcode');


const run = (memory, gridSize) => {
  let grid = [];

  for (let y = 0; y < gridSize; y++) {
    let row = [];
    for (let x = 0; x < gridSize; x++) {
      const computer = new intcode.IntCodeComputer([...memory]);
      computer.addInput(x);
      computer.addInput(y);

      let result = computer.run();
      row.push(result);
    }
    grid.push(row);
  }

  return grid;
};

const search = (memory, size, beamSquareSize) => {
  const grid = [];
  let shipFits = false;
  let closestSquare;
  let beams = [];
  while (!shipFits) {
    for (let y = 0; y < size; y++) {
      let row = grid[y];
      if (row == undefined) {
        grid.push([]);
      }
      let beam = { size: 0 };
      for (let x = 0; x < size; x++) {
        let result;
        if (grid[y][x] == undefined) {
          const computer = new intcode.IntCodeComputer([...memory]);
          computer.addInput(x);
          computer.addInput(y);

          result = computer.run();
          grid[y][x] = result;
        } else {
          result = grid[y][x];
        }


        if (result === 1) {
          if (beam.size === 0) {
            beam.start = { x: x, y: y };
          }
          if (x + 1 === size) {
            beam.end = { x: x, y: y };
          }
          beam.size += 1;
        } else {
          if (beam.size > 0 && !('end' in beam)) {
            beam.end = { x: x - 1, y: y };
          }
        }
      }
      if (beam.size >= beamSquareSize)
        beams.push(beam);
    }

    console.log(beams.length);
    closestSquare = findClosestSquare(beams, beamSquareSize);

    if (closestSquare) {
      shipFits = true;
    }
    console.log(`size: ${size}`);
    size++;
  }

  return closestSquare;
};

const findClosestSquare = (beams, size) => {
  for (let beamTop of beams) {
    for (let beamBottom of beams) {
      if (beamTop.size < size || beamBottom.size < size ||
          beamTop.start.y > beamBottom.start.y ||
          beamBottom.start.x > beamTop.end.x)
        continue;

      if (beamTop.end.x >= beamBottom.start.x + size - 1 &&
          beamTop.end.y + size - 1 <= beamBottom.end.y) {
        return beamTop;
      }
    }
  }
  return null;
};

const getNumValues = (grid, value) => {
  let numValues = 0;
  for (let row of grid) {
    for (let v of row) {
      if (v === value) {
        numValues++;
      }
    }
  }
  return numValues;
};

const printGrid = (grid) => {
  for (let row of grid) {
    console.log(row.join(''));
  }
};

(async () => {
  // main
  const inputFile = process.argv[2];
  const part = process.argv[3];

  const originalMemory = await intcode.readInput(inputFile);
  if (part == 1) {
    console.log('Part 1');
    let grid = run(originalMemory, 50);
    printGrid(grid);

    const affected = getNumValues(grid, 1);
    console.log(affected);

  } else {
    console.log('Part 2');
    let size = 1000, beamSquareSize = 100;
    if (process.argv[4]) {
      [size, beamSquareSize] = process.argv[4].split(':').map(Number);
    }
    let closest = search(originalMemory, size, beamSquareSize);
    console.log(closest);

    console.log((closest.end.x - beamSquareSize - 1) * 10000 + closest.start.y);
  }
})();
