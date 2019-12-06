const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const readInput = async (input) => {
  return readFile(input, 'utf8').then(data => {
    return data.trim().split('\n');
  });
};

const parseMap = (rawMap) => {
  const map = {};
  for (let orbit of rawMap) {
    let [center, satelite] = orbit.split(')');
    map[satelite] = center;
  }
  return map;
};

const checkSum = (map) => {
  return Object.keys(map).reduce((sum, object) => sum + orbits(map, object), 0);
};

const orbits = (map, object) => {
  if (object === "COM") {
    return 0;
  } else {
    return 1 + orbits(map, map[object]);
  }
};

const path = (map, source, destination = "COM") => {
  let p = [];

  let location = source;
  while (location != destination) {
    location = map[location];
    p.push(location);
  }

  return p;
};

const shortestPath = (path1, path2) => {
  let shortest = [];
  for (let loc1 = 0; loc1 < path1.length; loc1++) {
    for (let loc2 = 0; loc2 < path2.length; loc2++) {
      if (path1[loc1] === path2[loc2]) {
        let distance = loc1 + loc2;
        if (shortest.length == 0 || distance < shortest[0] + shortest[1]) {
          shortest[0] = loc1;
          shortest[1] = loc2;
        }
      }
    }
  }

  return shortest;
};

(async () => {
  // main
  const input = process.argv[2];
  const part = process.argv[3];

  const rawMap = await readInput(input);
  const map = parseMap(rawMap);
  if (part == 1) {
    console.log(JSON.stringify(map, null, 2));
    console.log(checkSum(map));
  } else {
    let p1 = path(map, "YOU");
    let p2 = path(map, "SAN");
    console.log(p1);
    console.log(p2);
    let shortest = shortestPath(p1, p2);
    console.log(shortest[0] + shortest[1]);
  }
})();
