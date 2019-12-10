const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const ERROR = 0.00001;
const QUADRANTS = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
};

const readInput = async (input) => {
  return readFile(input, 'utf8')
    .then(data => data.trim().split('\n'))
    .then(map => map.map(row => row.split('')));
};

const visibleAsteroids = (map, loc) => {
  let visibles = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (loc.x === x && loc.y === y)
        continue;

      if (map[y][x] === '#') {
        let intermediateCoords = getIntermediateCoords({ x: x, y: y }, loc);
        let allClear = intermediateCoords.every(coord => map[coord.y][coord.x] === '.');

        if (allClear) {
          visibles.push({ x: x, y: y });
        }
      }
    }
  }
  return visibles;
};

const getIntermediateCoords = (coord, origin) => {
  let slope = 0;
  if (coord.x != origin.x) {
    slope = (coord.y - origin.y) / (coord.x - origin.x);
  }

  let start, der, target;
  if (origin.x < coord.x) {
    start = origin.x + 1, der = origin.y;
    target = coord.x;
  } else if (origin.x > coord.x) {
    start = coord.x + 1, der = coord.y;
    target = origin.x;
  } else if (origin.y < coord.y) {
    start = origin.y + 1, der = origin.x;
    target = coord.y;
  } else {
    start = coord.y + 1, der = coord.x;
    target = origin.y;
  }

  let intermediates = [];
  while (start < target) {
    der += slope;
    if (Math.abs(Math.round(der) - der) < ERROR) {
      der = Math.round(der);
    }

    if (Number.isInteger(der)) {
      if (coord.x == origin.x) {
        intermediates.push({ x: der, y: start });
      } else {
        intermediates.push({ x: start, y: der });
      }
    }

    start += 1;
  }

  return intermediates;
};

const sortCoordinatesClockwise = (coords, origin) => {
  let sortCoords = (coord1, coord2) => degrees(coord1, origin) - degrees(coord2, origin);

  return coords.sort(sortCoords);
};

const degrees = (coord, origin) => {
  const deltaY = (origin.y - coord.y);
  const deltaX = (coord.x - origin.x);
  const radians = -1 * Math.atan2(deltaY, deltaX);

  const degrees = radians * (180 / Math.PI) + 90;

  return (degrees < 0) ? (degrees + 360) : degrees;
};


const stationLocationPotential = (map) => {
  let results = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] == '#') {
        let result = visibleAsteroids(map, { x: x, y: y });
        // console.log(`(${x}, ${y}): ${result.length} - ${result.map(r => `(${r.x}, ${r.y})`).join(', ')}`);
        results.push({ x: x, y: y, visible: result.length });
      }
    }
  }
  return results;
};

const vaporize = (map, coord) => {
  map[coord.y][coord.x] = '.';
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
    printMap(map);
    const potentialMap = stationLocationPotential(map);
    console.log(potentialMap);
    let { x, y, visible } = potentialMap.reduce((prev, current) => (prev.visible > current.visible) ? prev : current);
    console.log(`(${x}, ${y}) = ${visible}:  ${JSON.stringify(visibleAsteroids(map, { x: x, y: y }))}`);
  } else if (part == 2) {
    const asteroidNum = Number(process.argv[4]);
    printMap(map);
    const potentialMap = stationLocationPotential(map);
    console.log(potentialMap);
    let { x, y } = potentialMap.reduce((prev, current) => (prev.visible > current.visible) ? prev : current);

    let asteroids = visibleAsteroids(map, { x: x, y: y });
    let sorted = sortCoordinatesClockwise(asteroids, { x: x, y: y });

    let numVaporized = 0;
    let i = 0;
    while (numVaporized < asteroidNum - 1) {
      console.log(sorted);
      for (i = 0; numVaporized < asteroidNum -1 && i < sorted.length; i++) {
        let coord = sorted[i];
        console.log(coord, numVaporized + 1);
        vaporize(map, coord);
        numVaporized++;
      }

      if (i === sorted.length) {
        asteroids = visibleAsteroids(map, { x: x, y: y });
        sorted = sortCoordinatesClockwise(asteroids, { x: x, y: y });
      }
    }
    console.log(sorted[i]);
  } else if (part == 3) {
    const [x1, y1] = process.argv[4].split(':').map(Number);
    const [x2, y2] = process.argv[5].split(':').map(Number);

    console.log(JSON.stringify(getIntermediateCoords({ x: x1, y: y1 }, { x: x2, y: y2 })));
  }
})();
