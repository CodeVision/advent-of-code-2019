const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const AXES = ['x', 'y', 'z'];


const readInput = async (input) => {
  return readFile(input, 'utf8')
    .then(data => data.trim().split('\n'))
    .then(rows => rows.map(row => {
      const [, x, y, z]= /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/.exec(row);
      return { x: Number(x), y: Number(y), z: Number(z) };
    }));
};

const getNewVelocity = (moon, moons) => {
  const velocity = {...moon.vel};
  for (let selectedMoon of moons) {
    if (selectedMoon != moon) {
      for (let axis of AXES) {
        if (selectedMoon.pos[axis] > moon.pos[axis]) {
          velocity[axis] += 1;
        } else if (selectedMoon.pos[axis] < moon.pos[axis]) {
          velocity[axis] -= 1;
        }
      }
    }
  }
  return velocity;
};

const getNewPosition = (moon) => {
  const pos = {...moon.pos};
  for (let axis of AXES) {
    pos[axis] += moon.vel[axis];
  }
  return pos;
};

const printC = (coords) => {
  const posS = `pos<x=${coords.pos.x}, y=${coords.pos.y}, z=${coords.pos.z}>`;
  const velS = `vel<x=${coords.vel.x}, y=${coords.vel.y}, z=${coords.vel.z}>`;
  console.log(`${posS}, ${velS}`);
};

const getEnergy = (moon) => {
  let potentialEnergy = 0;
  for (let axis of AXES) {
    potentialEnergy += Math.abs(moon.pos[axis]);
  }

  let kineticEnergy = 0;
  for (let axis of AXES) {
    kineticEnergy += Math.abs(moon.vel[axis]);
  }

  return potentialEnergy * kineticEnergy;
};

const simulate = (moons, steps, log = true) => {
  if (log) {
    console.log(`Steps 0`);
    for (let moon of moons) {
      printC(moon);
    }
  }

  for (let step = 1;step <= steps; step++) {
    for (let moon of moons) {
      moon.vel = getNewVelocity(moon, moons);
    }

    for (let moon of moons) {
      moon.pos = getNewPosition(moon);
    }

    if (log) {
      console.log(`Step ${step}`);
      for (let moon of moons) {
        printC(moon);
      }
    }
  }
};

const findCycles = (moons, axis) => {
  for (let step = 1; step <= Infinity; step++) {
    for (let moon of moons) {
      moon.vel = getNewVelocity(moon, moons);
    }

    for (let moon of moons) {
      moon.pos = getNewPosition(moon);
    }

    if (moons.every(moon => moon.vel[axis] === 0)) {
      for (let moon of moons) {
        printC(moon);
      }
      return step;
    }
  }
};

const gcd = (a, b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);

const createMoons = (positions) => {
  const moons = [];
  for (let pos of positions) {
    moons.push({ pos: pos, vel: { x: 0, y: 0, z: 0 } });
  }
  return moons;
};

(async () => {
  // main
  const input = process.argv[2];
  const part = process.argv[3];

  const positions = await readInput(input);

  if (part == 1) {
    console.log('Part 1');
    const steps = Number(process.argv[4]);
    const moons = createMoons([...positions]);
    simulate(moons, steps);

    console.log(moons.reduce((sum, moon) => sum += getEnergy(moon), 0));
  } else if (part == 2) {
    console.log('Part 2');
    let cycles = {};
    for (let axis of AXES) {
      let moons = createMoons([...positions]);
      cycles[axis] = findCycles(moons, axis);
    }

    console.log(cycles);
    console.log(2 * Object.values(cycles).reduce(lcm));
  } else {
    const nums = process.argv[4].trim().split(',').map(Number);
    console.log(nums.reduce(lcm));
  }
})();
