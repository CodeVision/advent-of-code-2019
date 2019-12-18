const fs = require('fs');
const util = require('util');

/* eslint-disable no-console */

const readFile = util.promisify(fs.readFile);

const readInput = async (input) => {
  return readFile(input, 'utf8')
    .then(data => data.trim().split('\n'))
    .then(lines => lines.map(line => line.split('')));
};

const findKeys = (map) => {
  const keys = {};
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      let item = map[row][col];
      if (item !== '#' && item !== '.' && item !== '@') {
        keys[item] = { x: col, y: row };
      }
    }
  }
  return keys;
};

const findPosition = (map) => {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === '@') {
        return { x: col, y: row };
      }
    }
  }
};


const POS_CACHE = {};

const contains = (explored, pos) => {
  for (let e of explored) {
    if (e.loc.x == pos.x && e.loc.y == pos.y)
      return true;
  }
  return false;
};

const explore = (map) => {
  let start = findPosition(map);
  let explored = [];
  let toExplore = [];
  for (let loc of getAdjacent(map, start)) {
    toExplore.push({ loc, path: [start] });
  }
  // console.log(`toExplore: ${JSON.stringify(toExplore)}`);
  while (toExplore.length > 0) {
    let pos = toExplore.shift();
    // console.log(pos);
    explored.push(pos);

    for (let neighbour of getAdjacent(map, pos.loc)) {
      // console.log(neighbour);
      // console.log(`toExplore: ${JSON.stringify(toExplore)}`);
      // console.log(`explored: ${JSON.stringify(explored)}`);
      if (!contains(toExplore, neighbour)) {
        let newPath = pos.path.concat(pos.loc);
        if (contains(explored, neighbour)) {
          let loc = getExploredLoc(explored, neighbour);
          if (newPath.length < loc.path.length) {
            loc.path = newPath;
          }
        } else {
          toExplore.unshift({ loc: neighbour, path: newPath });
        }
      }
    }
  }

  return explored;
};

const getExploredLoc = (explored, loc) => {
  for (let exploredLoc of explored) {
    if (exploredLoc.loc.x == loc.x && exploredLoc.loc.y == loc.y) {
      return exploredLoc;
    }
  }
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

const getKeyOrder = (map) => {
  let keys = Object.keys(map);
  for (let i = 0; i < keys.length; i++) {
    // do some sorting
  }
  return keys;
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

  const map = await readInput(input);
  if (part == 1) {
    console.log('Part 1');
    printMap(map);
    const keyMap = findKeys(map);
    let pathMap = explore(map);

    let keys = {};
    let doors = {};
    for (let key of Object.keys(keyMap)) {
      let loc = keyMap[key];
      if (key.match(/[a-z]/)) {
        keys[`${loc.x}:${loc.y}`] = key;
      } else if (key.match(/[A-Z]/)) {
        doors[`${loc.x}:${loc.y}`] = key;
      }
    }

    let requiredDoors = {};
    for (let explored of pathMap) {
      let coordIndex = `${explored.loc.x}:${explored.loc.y}`;
      if (coordIndex in keys) {
        let encDoors = explored.path.filter(p => `${p.x}:${p.y}` in doors);

        requiredDoors[keys[coordIndex]] = encDoors.map(ed => doors[`${ed.x}:${ed.y}`]);
      }
    }
    console.log(requiredDoors);

    const keyOrder = getKeyOrder(requiredDoors);
    console.log(keyOrder);
  } else if (part == 2) {
    console.log('Part 2');
  }
})();
