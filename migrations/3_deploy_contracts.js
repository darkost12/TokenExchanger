const AirToken = artifacts.require("./AirToken.sol");

module.exports = function(deployer) {
  deployer.deploy(AirToken);
};
