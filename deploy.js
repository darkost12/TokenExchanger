module.exports = function(callback) {
    const {expectEvent, expectRevert} = require('@openzeppelin/test-helpers');
    const Web3 = require('web3');
    const web3 = new Web3("HTTP://127.0.0.1:8545")
    const FireToken = artifacts.require("./FireToken.sol");
    const AirToken = artifacts.require("./AirToken.sol");
    const Exchanger = artifacts.require("./Exchanger.sol");

    const promise = (async function deployment() {
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        console.log("1");
        hren = await Exchanger.deployed();
        console.log("2");
        web3.eth.defaultAccount = accounts[1];
        console.log("3");
        fire = await FireToken.deployed({from: accounts[1]})
                console.log((await fire.balanceOf(accounts[0])).toNumber());
                console.log((await fire.balanceOf(accounts[1])).toNumber());
                console.log((await fire.balanceOf(accounts[2])).toNumber());
        console.log("5");
        web3.eth.defaultAccount = await accounts[2];
        air = await AirToken.deployed();
                console.log((await air.balanceOf(accounts[0])).toNumber());
                console.log((await air.balanceOf(accounts[1])).toNumber());
                console.log((await air.balanceOf(accounts[2])).toNumber());
        console.log("6");
    })();

    console.log('sagsgas');
    promise.then(() => callback()).catch(error => {
        console.error(error);
        callback();
    });
}
