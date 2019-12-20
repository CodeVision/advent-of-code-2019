const fs = require('fs');
const util = require('util');

/* eslint-disable no-console */

const readFile = util.promisify(fs.readFile);

const readInput = async (input) => {
  return readFile(input, 'utf8')
    .then(data => data.trimRight().split('\n'))
    .then(lines => lines.map(line => line.split('')));
};

const findNamedLocations = (rawMap, border) => {
  const locations = {};
  for (let row = 0; row < rawMap.length; row++) {
    for (let col = 0; col < rawMap[row].length; col++) {
      let item = rawMap[row][col];
      if (item.match(/[A-Z]/)) {
        if (row < rawMap.length - 1 && rawMap[row+1][col].match(/[A-Z]/)) {
          let key = item + rawMap[row+1][col];
          let loc;
          if (rawMap[row+2] && rawMap[row+2][col] == '.') {
            loc = { x: col - border, y: row + 2 - border };
          } else {
            loc = { x: col - border, y: row -1 - border };
          }
          if (key in locations) {
            locations[key].push(loc);
          } else {
            locations[key] = [loc];
          }
        } else if (col < rawMap[row].length - 1 && rawMap[row][col+1].match(/[A-Z]/)) {
          let key = item + rawMap[row][col+1];
          let loc;
          if (rawMap[row][col+2] === '.') {
            loc = { x: col + 2 - border, y: row - border};
          } else {
            loc = { x: col - 1 - border, y: row - border };
          }
          if (key in locations) {
            locations[key].push(loc);
          } else {
            locations[key] = [loc];
          }
        }
      }
    }
  }
  return locations;
};

const parseMap = (rawMap, step) => {
  const map = [];
  for (let y = step; y < rawMap.length - step; y++) {
    let row = [];
    for (let x = step; x < rawMap[y].length - step; x++) {
      let char = rawMap[y][x];

      if (char && [' ', '#', '.'].includes(char)) {
        row.push(char);
      } else {
        row.push(' ');
      }
    }
    map.push(row);
  }

  return map;
};

const getAdjacent = (map, pos) => {
  let adjacent = [];
  let x = pos.x, y = pos.y;
  if (map[y][x + 1] !== '#') {
    adjacent.push({ x: x + 1, y: y });
  }
  if (map[y][x - 1] !== '#') {
    adjacent.push({ x: x - 1, y: y });
  }
  if (map[y + 1][x] !== '#') {
    adjacent.push({ x: x, y: y + 1 });
  }
  if (map[y - 1][x] !== '#') {
    adjacent.push({ x: x, y: y - 1 });
  }
  return adjacent;
};

const printMap = (map) => {
  for (let row of map) {
    console.log(row.join(''));
  }
};


(async () => {
  // main
  const input = process.argv[2];
  const part = process.argv[3];

  const rawMap = await readInput(input);
  if (part == 1) {
    console.log('Part 1');
    let border = 2;
    const map = parseMap(rawMap, border);
    printMap(map);
    const namedLocations = findNamedLocations(rawMap, border);
    console.log(JSON.stringify(namedLocations, null, 2));
  } else if (part == 2) {
    console.log('Part 2');
  }
})();
