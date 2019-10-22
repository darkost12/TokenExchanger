const FireToken = artifacts.require("./FireToken.sol");

module.exports = function(deployer) {
  deployer.deploy(FireToken);
};
