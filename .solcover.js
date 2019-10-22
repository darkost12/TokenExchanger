module.exports = {
    norpc: false,
    testCommand: 'node --max-old-space-size=4096 ../node_modules/.bin/truffle test --network coverage',
    copyPackages: ['openzeppelin-solidity'],
    skipFiles: ['contracts/Migrations.sol']
}
