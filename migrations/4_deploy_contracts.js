const Exchanger = artifacts.require("./Exchanger.sol");

module.exports = function(deployer) {
  deployer.deploy(Exchanger);
};
