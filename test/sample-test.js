const { getSigners } = require("@nomiclabs/hardhat-ethers/dist/src/helpers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Financing", function() {
  const ETHERS = 10**18;
  const numOfDonates = 2;

  const deployContract = async () => {
    const Donation = await ethers.getContractFactory("Donation");
    const donation = await Donation.deploy();

    return donation.deployed();
  }

  const getContractBalance = async (contract) => {
    return web3.eth.getBalance(contract.address);
  }

  it("deploy contract", async () => {
    contract = await deployContract();
  });

  it("make donations from different accounts", async () => {
    signers = await ethers.getSigners();

    let startBalance = await getContractBalance(contract);
    expect(startBalance).to.be.eq('0');

    let expectedBalance = 0;
    for(var i = 1; i <= numOfDonates; i++){
      await contract.connect(signers[i]).giveDonation({
        value: ETHERS * .004
      });

      expectedBalance += ETHERS * .004;
    }

    let endBalance = await getContractBalance(contract);
    expect(endBalance).to.be.eq(expectedBalance.toString());
  });

  it("donations from one address are summarized", async () => {
    let signer = signers[0];
    let donate = ETHERS * .004;

    await contract.connect(signer).giveDonation({
      value: donate
    });

    let actualDonate = await contract.totalDonation(signer.getAddress());
    expect(actualDonate).to.be.eq(donate);

    await contract.connect(signer).giveDonation({
      value: donate
    });

    actualDonate = await contract.totalDonation(signer.getAddress());
    expect(actualDonate).to.be.eq(2 * donate);
  });

  it("check contract has donators addresses", async () => {
    for(var i = 1; i <= numOfDonates; i++){
      let signer = signers[i].getAddress();
      let flag = await contract.checkSender(signer);

      assert.equal(flag, true);
    }
  });

  it("transfer donations from contract", async () => {
    let startContrBalance = await getContractBalance(contract);
    expect(startContrBalance).to.not.be.eq('0');

    let addrs = signers.slice(numOfDonates - 1);

    for(var i = 0; i < numOfDonates + 2; i++){
      await contract.getDonation(addrs[i].getAddress(), ETHERS * .004);
    }

    let endcontractBalance = await getContractBalance(contract);
    expect(endcontractBalance).to.be.eq('0');
  });
});




