'use strict';

/* eslint-disable no-console */
const intcode = require('./lib/intcode');


const DIRECTIONS = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

const createMap = (width, height, start_panel = false) => {
  const map = [];
  for (let row = 0; row < height; row++) {
    let r = [];
    for (let col = 0; col < width; col++) {
      if (start_panel && col == Math.round(width / 2) && row == Math.round(height / 2))
        r.push(1);
      else
        r.push(0);
    }
    map.push(r);
  }
  return map;
};

const getColor = (map, loc) => {
  return map[loc.y][loc.x] || 0;
};

const setColor = (map, loc, color) => {
  map[loc.y][loc.x] = color;
};

const getMiddle = (map) => {
  return { x: Math.round(map[0].length / 2), y: Math.round(map.length / 2) };
};

const getPosition = (pos, direction) => {
  switch(direction) {
    case DIRECTIONS.UP:
      return { x: pos.x, y: pos.y - 1 };
    case DIRECTIONS.RIGHT:
      return { x: pos.x + 1, y: pos.y };
    case DIRECTIONS.DOWN:
      return { x: pos.x, y: pos.y + 1 };
    case DIRECTIONS.LEFT:
      return { x: pos.x - 1, y: pos.y };
  }
};

const getDirection = (direction, move) => {
  const numDirections = Object.keys(DIRECTIONS).length;
  let newDirection;
  if (move === 0) {
    newDirection = (direction -1 + numDirections);
  } else {
    newDirection = (direction + 1);
  }

  return newDirection % numDirections;
};

const getSubChar = (direction) => {
  switch(direction) {
    case DIRECTIONS.UP:
      return '^';
    case DIRECTIONS.RIGHT:
      return '>';
    case DIRECTIONS.DOWN:
      return 'v';
    case DIRECTIONS.LEFT:
      return '<';
  }
};

const printMap = (map, pos, direction) => {
  for (let row = 0; row < map.length; row++) {
    let line = map[row].map(c => c === 0 ? ' ' : '#');
    if (row === pos.y) {
      let sub = getSubChar(direction);
      line[pos.x] = sub;
    }

    console.log(line.join(''));
  }
};

const run = (memory, map, paintMap = false) => {
  let pos = getMiddle(map);
  let direction = DIRECTIONS.UP;
  const computer = intcode.run(memory, [getColor(map, pos)]);

  let painted = [];
  let result = computer.next().value;
  while (result && !result.done) {
    console.log(`paint: ${result.output}`);
    setColor(map, pos, result.output);
    painted.push(pos);
    result = computer.next().value;
    console.log(`move: ${result.output}`);
    direction = getDirection(direction, result.output);
    pos = getPosition(pos, direction);
    console.log(`(${pos.x},${pos.y}): ${getColor(map, pos)}`);
    result = computer.next(getColor(map, pos)).value;

    if (paintMap)
      printMap(map, pos, direction);
  }


  return painted;
};

(async () => {
  // main
  const inputFile = process.argv[2];
  const part = process.argv[3];

  const originalMemory = await intcode.readInput(inputFile);
  if (part == 1) {
    const map = createMap(150, 150);
    let painted = run([...originalMemory], map);
    let paintedString = painted.map(c => `${c.x}:${c.y}`);
    console.log([...new Set(paintedString)].length);

  } else {
    const map = createMap(150, 150, true);
    run([...originalMemory], map, true);
  }
})();
