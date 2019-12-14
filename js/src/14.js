const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const readInput = async (input) => {
  return readFile(input, 'utf8')
    .then(data => data.trim().split('\n'))
    .then(lines => {
      let result = {};
      for (let line of lines) {
        let raw = line.split('=>');
        let [quantity, output] = raw[1].trim().split(' ');
        result[output] = { quantity: Number(quantity), inputs: [] };

        let inputs = raw[0].trim().split(', ');
        for (let input of inputs) {
          let [q, chem] = input.split(' ');
          result[output].inputs.push({ quantity: Number(q), chemical: chem });
        }
      }
      return result;
    });
};

const consolidate = (raw) => {
  const consolidated = {};
  for (let { chemical, quantity } of raw) {
    if (consolidated[chemical]) {
      consolidated[chemical] += quantity;
    } else {
      consolidated[chemical] = quantity;
    }
  }

  let result = [];
  for (let chem in consolidated) {
    result.push({ chemical: chem, quantity: consolidated[chem] });
  }
  return result;
};

const getOres = (inputs, reactions) => {
  // console.log(`retrieving ${JSON.stringify(inputs, null, 2)}`);
  let work = [...inputs];
  let leftovers = {};
  while (work.length > 1 || work[0].chemical !== 'ORE') {
    let input = work.shift();

    if (input.chemical !== 'ORE') {
      // console.log(JSON.stringify(input));


      let chemical = input.chemical;
      let reaction = reactions[chemical];
      let numLeftovers = leftovers[chemical] || 0;
      if (numLeftovers >= input.quantity) {
        leftovers[chemical] -= input.quantity;
        input.quantity = 0;
      } else {
        leftovers[chemical] = 0;
        input.quantity -= numLeftovers;
      }

      let numReactions = Math.ceil(input.quantity / reaction.quantity);
      for (let newInput of reaction.inputs) {
        let req = { quantity: numReactions * newInput.quantity, chemical: newInput.chemical };
        work.push(req);
      }

      if (input.quantity % reaction.quantity > 0) {
        let surplus = reaction.quantity * numReactions - input.quantity;
        if (leftovers[input.chemical]) {
          leftovers[input.chemical] += surplus;
        } else {
          leftovers[input.chemical] = surplus;
        }
      }
      // console.log(JSON.stringify(leftovers, null, 2));

    } else {
      work.push(input);
    }

    // console.log(JSON.stringify(work, null, 2));

    work = consolidate(work);
  }

  return work[0].quantity;
};

(async () => {
  // main
  const input = process.argv[2];
  const part = process.argv[3];

  const reactions = await readInput(input);
  if (part == 1) {
    console.log('Part 1');
    console.log(JSON.stringify(reactions, null, 2));

    const [ quantity, chemical ] = process.argv[4].split(':');

    let required = getOres([{ quantity: Number(quantity), chemical }], reactions);
    console.log(required);
  } else {
    console.log('Part 2');

    let singleRequired = getOres([{ quantity: 1, chemical: 'FUEL' }], reactions);

    let totalOre = 1000000000000;
    let minQuantity = Math.floor(totalOre / singleRequired);
    let maxQuantity = totalOre;

    let required = 0, quantity = Math.floor((maxQuantity - minQuantity) / 2);
    while (minQuantity < maxQuantity - 1) {
      required = getOres([{ quantity, chemical: 'FUEL' }], reactions);

      if (required >= totalOre) {
        maxQuantity = quantity;
      } else {
        minQuantity = quantity;
      }
      quantity = minQuantity + Math.floor((maxQuantity - minQuantity) / 2);
      console.log(`${minQuantity}-${maxQuantity}`);
      console.log(`${quantity} requires ${required} ore`);
    }

    console.log(`${quantity} requires ${required} ore`);
  }
})();
