const path = require('path');
const fs = require('fs-extra');//extra installed module with helpers
const solc = require('solc');//solidity complier

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);


const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');//read in sourcecode from file
//we use solidity compiler to compile everything we just pulled from file,
//the output variable will have 2 objects, the output from campain contract and from campaign factory
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);//ensure that a directory exist and if it doesnt creates it for us

//output currently has 2 objects with the bytecode
//loop over output and for each contract, we create a new file for it inside our build directory
for (let contract in output) {
  //write out json file to build directory
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}
