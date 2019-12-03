const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const readInput = async (input) => {
  return readFile(input, 'utf8').then(data => {
    return data.trim().split('\n');
  }).then(paths => {
    return paths.map(path => path.split(','));
  });
};

const manhattanDistance = (loc1, loc2) => {
  return Math.abs(loc1[0] - loc2[0]) + Math.abs(loc1[1] - loc2[1]);
};

const createGrid = (size) => {
  let grid = [];
  for (let i = 0; i < size; i += 1) {
    let row = [];
    grid.push(row);
  }
  return grid;
}

const walkPath = (grid, origin, path, marker) => {
  let loc = origin;

  let steps = 0;
  for (let p = 0; p < path.length; p += 1) {
    let section = path[p];
    console.log(section);
    let instr = section.charAt(0);
    let dist = Number(section.substring(1));

    for (let i = 1; i <= dist; i += 1) {
      steps++;

      if (instr == 'U') {
        loc[0] -= 1;
      } else if (instr == 'D') {
        loc[0] += 1;
      } else if (instr == 'L') {
        loc[1] -= 1;
      } else {
        loc[1] += 1;
      }

      if (!grid[loc[0]][loc[1]]) {
        grid[loc[0]][loc[1]] = {};
      }
      grid[loc[0]][loc[1]][marker] = steps;
    }
  }

  return grid;
}

const findIntersections = (grid, markers) => {
  const intersections = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      if (grid[y][x] && markers.every(marker => marker in grid[y][x])) {
        intersections.push([x, y, grid[y][x]]);
      }
    }
  }
  return intersections;
}

const printGrid = (grid) => {
  for (let row of grid) {
    for (let v of row) {
      if (v) {
        process.stdout.write(v);
      } else {
        process.stdout.write('.');
      }
    }
    console.log();
  }
}

(async () => {
  // main
  const input = process.argv[2];
  const part = process.argv[3];
  const gridSize = process.argv[4];

  const paths = await readInput(input);

  const grid = createGrid(gridSize);

  let middle = grid.length / 2;
  grid[middle][middle] = {'o': true};
  let origin = [middle, middle];

  walkPath(grid, [...origin], paths[0], '1');
  walkPath(grid, [...origin], paths[1], '2');

  console.log(origin);
  let intersections = findIntersections(grid, ['1', '2']);
  console.log(intersections);
  if (part == 1) {
    let closest = Math.min(...intersections.map(intersection => manhattanDistance(origin, intersection)));
    console.log(closest);
  } else {
    let fewestSteps = Math.min(...intersections.map(intersection => intersection[2]['1'] + intersection[2]['2']));
    console.log(fewestSteps);
  }
})();
