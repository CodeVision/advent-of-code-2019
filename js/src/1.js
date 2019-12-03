const util = require('util');
const lineReader = require('line-reader');
const eachLine = util.promisify(lineReader.eachLine);


const fuel = (mass) => {
  const fuelAmount = Math.floor(mass / 3) - 2;
  return fuelAmount >= 0 ? fuelAmount : 0;
};


input = process.argv[2];
console.log(`Processing: ${input}`);

requirement = []
eachLine(input, (line) => {
  let req = fuel(line);
  let totalReq = req;
  while (req > 0) {
    req = fuel(req);
    totalReq += req;
  }
  requirement.push(totalReq);
}).then(() => {
  console.log(requirement.reduce((sum, num) => sum + num));
})
