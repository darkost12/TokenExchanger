const FireToken = artifacts.require("./FireToken.sol");
const AirToken = artifacts.require("./AirToken.sol");
const Exchanger = artifacts.require("./Exchanger.sol");

module.exports = function(deployer) {
  deployer.deploy(FireToken);
  deployer.deploy(AirToken);
  deployer.deploy(Exchanger);
};
