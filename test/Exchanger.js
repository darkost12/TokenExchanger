const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:8545');
const FireToken = artifacts.require('./FireToken.sol');
const AirToken = artifacts.require('./AirToken.sol');
const Exchanger = artifacts.require('./Exchanger.sol');
const accounts = web3.eth.getAccounts();

contract('Exchanger', async accounts => {
  beforeEach(async () => {
    fire = await FireToken.new();
    air = await AirToken.new();
    change = await Exchanger.new();
    await fire.transfer(accounts[1], 555555);
    await air.transfer(accounts[2], 444444);
    await change.addNewToken('FIRE', await fire.address);
    await change.addNewToken('AIR', await air.address);
  });

  it('should add and remove tokens', async () => {
    testToken = await FireToken.new();
    await change.addNewToken('TEST', await testToken.address);
    await testToken.approve(change.address, 500);
    await fire.approve(change.address, 500, { from: accounts[1] });
    await expectEvent(
      await change.transferTokens(
        'TEST',
        'FIRE',
        accounts[1],
        456
      ),
      'TransferSuccessful', {
        from_: accounts[0],
        to_: accounts[1],
        amount_: '456',
      }
    );
    await change.removeToken('TEST');
    await expectRevert.unspecified(change.transferTokens(
      'TEST',
      'Fire',
      accounts[1],
      4
    ));
  });

  it('should be impossible to transfer with no allowance', async () => {
    await expectRevert.unspecified(change.transferTokens(
      'FIRE',
      'AIR',
      accounts[2],
      500,
      { from: accounts[1] }
    ));
  });

  it('should be possible to transfer with allowance', async () => {
    await fire.approve(
      change.address,
      500,
      { from: accounts[1] }
    );
    await air.approve(
      change.address,
      500,
      { from: accounts[2] }
    );
    await change.transferTokens(
      'FIRE',
      'AIR',
      accounts[2],
      500,
      { from: accounts[1] }
    );
    assert.equal(
      (await air.balanceOf(accounts[1])).toNumber(),
      500,
      'Error in token transfer has happened'
    );
    assert.equal(
      (await fire.balanceOf(accounts[2])).toNumber(),
      500,
      'Error in token transfer has happened'
    );
    assert.equal(
      (await fire.balanceOf(accounts[1])).toNumber(),
      555055,
      'Error in token transfer has happened'
    );
    assert.equal(
      (await air.balanceOf(accounts[2])).toNumber(),
      443944,
      'Error in token transfer has happened'
    );
  });

  it('should be impossible to send with not enough tokens', async () => {
    await air.approve(
      change.address,
      1500,
      { from: accounts[2] }
    );
    await fire.approve(
      change.address,
      1500,
      { from: accounts[3] }
    );
    await expectRevert.unspecified(change.transferTokens(
      'FIRE',
      'AIR',
      accounts[2],
      1500,
      { from: accounts[3] }
    ));
    assert.equal(
      (await fire.balanceOf(accounts[3])).toNumber(),
      0,
      'Exchange with fake token was successful (1)'
    );
    assert.equal(
      (await air.balanceOf(accounts[3])).toNumber(),
      0,
      'Exchange with fake token was successful (2)'
    );
  });
});
