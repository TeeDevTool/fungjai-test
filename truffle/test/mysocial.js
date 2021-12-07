var MySocial = artifacts.require("../contract/MySocial.sol");

const ether = 10 ** 18; // 1 ether = 1000000000000000000 wei
const star = 100;
const initialEther = 4 * ether;
const initialBalance = 20 * ether;
const donates = 10 ** 10 * star;
const withdraws = 50 * star;
const withdrawBalance = (withdraws * 9) / 10;

contract("MySocial - end to end test", function (accounts) {
  const tee = { name: "tee", address: accounts[1] };
  const nam = { name: "nam", address: accounts[2] };
  const captions = "this is my first post";

  it("sign up new account - first post - donate - withdraw", async () => {
    const social = await MySocial.deployed();

    await social.register(tee.name, { from: tee.address });
    const teeBalance = await social.balance({ from: tee.address });
    assert.equal(teeBalance, initialEther, "Invalid initial ether");

    await social.register(nam.name, { from: nam.address });
    const namBalance = await social.balance({ from: nam.address });
    assert.equal(namBalance, initialEther, "Invalid initial ether");

    const getTeeName = await social.getAccountName({ from: tee.address });
    assert.equal(getTeeName, tee.name, "Invalid name");

    await social.post(tee.name, captions);

    await social.donate(tee.address, donates, {
      from: nam.address,
    });
    const namDonatedBalance = await social.balance({ from: nam.address });
    assert.equal(
      namDonatedBalance,
      initialEther - donates,
      "Invalid donation sender"
    );
    const teeDonatedBalance = await social.balance({ from: tee.address });
    assert.equal(
      teeDonatedBalance,
      initialEther + donates,
      "Invalid donation reciever"
    );

    const teeWithdraw = await social.withdraw.call(withdraws, {
      from: tee.address,
    });
    assert.equal(teeWithdraw, withdrawBalance, "Invalid withdraw");
  });
});
