const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("kek", function () {
  let kekFactory;
  let kek;
  let accountOne;
  let owner;
  beforeEach(async function () {
    let tokenTransfer;
    [owner, addressOne] = await ethers.getSigners();
    kekFactory = await ethers.getContractFactory("kek", owner);
    kek = await kekFactory.deploy();
  });

  it("Should tax the amount transferred by 2%", async function () {
    let taxed;
    let amountBack;
    let transferAmount = "500000000000000000000";

    taxed = await kek.getTaxed(transferAmount);
    await expect(taxed).to.equal("490000000000000000000");
  });

  it("Should pause the kek contract", async function () {
    let pause;

    pause = await kek.pauseContract();
    await expect(kek.transfer(addressOne.address, "500000000000000000000")).to
      .be.reverted;
  });

  it("Should pause and then unpause the kek contract", async function () {
    let pause;
    let unPause;
    let transfer;
    let transferAmount = "500000000000000000000";
    let addressOneKekBalance;

    pause = await kek.pauseContract();
    unPause = await kek.unPauseContract();
    transfer = await kek.transfer(addressOne.address, transferAmount);
    addressOneKekBalance = await kek.balanceOf(addressOne.address);
    await expect(addressOneKekBalance).to.equal("490000000000000000000");
  });

  it("Shoud burn 50000 tokens", async function () {
    let burnTokens;
    let tokenBalance;

    burnTokens = await kek.burn("50000000000000000000000");
    tokenBalance = await kek.balanceOf(owner.address);
    await expect(tokenBalance).to.equal("50000000000000000000000");
  });
});
