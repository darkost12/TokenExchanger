const { expectRevert } = require('@openzeppelin/test-helpers');
const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:8545');
const FireToken = artifacts.require('./FireToken.sol');
const accounts = web3.eth.getAccounts();

contract('FireToken', function (accounts) {
  it('initializes with total supply to owner', async () => {
    const inst = await FireToken.deployed();
    assert.equal(
      (await inst.totalSupply()).toNumber(),
      (await inst.balanceOf(accounts[0])).toNumber(),
      'Not equal'
    );
    assert.equal(
      (await inst.balanceOf(accounts[1])).toNumber(),
      0,
      'Not zero'
    );
  });

  it('should be possible to transfer', async () => {
    const inst = await FireToken.deployed();
    await inst.transfer(accounts[2], 555);
    assert.equal(
      (await inst.balanceOf(accounts[0])).toNumber(),
      (await inst.totalSupply()).toNumber() - 555,
      'Didn\'t subtract'
    );
    assert.equal(
      (await inst.balanceOf(accounts[2])).toNumber(),
      555,
      'Didn\'t receive'
    );
  });

  it('should transfer according to allowance', async () => {
    const inst = await FireToken.deployed();
    await inst.approve(accounts[3], 900);

    await expectRevert.unspecified(
      inst.transferFrom(
        accounts[0],
        accounts[3],
        1000,
        { from: accounts[3] }
      ),
      'No revert occured'
    );

    await inst.transferFrom(
      accounts[0],
      accounts[3],
      900,
      { from: accounts[3] }
    );

    assert.equal(
      (await inst.balanceOf(accounts[3])).toNumber(),
      900,
      'Not correct amount transfered'
    );
  });
});
