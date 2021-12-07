import Web3 from "web3";

import MySocialContractBuild from "contracts/MySocial.json";

export let selectedAccount;

export const initial = async () => {
  let provider = window.ethereum;

  if (typeof provider !== "undefined") {
    // Metamask is installed

    provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log(`Selected account is ${accounts}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  window.ethereum.on("accountsChanged", (accounts) => {
    selectedAccount = accounts[0];
    console.log(`Selected account change to ${accounts}`);
  });

  const web3 = new Web3(provider);

  const networkId = await web3.eth.net.getId();
  return new web3.eth.Contract(
    MySocialContractBuild.abi,
    MySocialContractBuild.networks[networkId].address
  );
};

export const register = async (name) => {
  const getContract = await initial();

  return getContract.methods.register(name).send({ from: selectedAccount });
};

export const getAccountName = async () => {
  const getContract = await initial();

  return getContract.methods.getAccountName().call({ from: selectedAccount });
};

export const feed = async () => {
  const getContract = await initial();

  return getContract.methods.feed().call({ from: selectedAccount });
};

export const post = async (name, caption) => {
  const getContract = await initial();

  return getContract.methods
    .post(name, caption)
    .send({ from: selectedAccount });
};

export const donate = async (reciever, amount) => {
  const getContract = await initial();

  return getContract.methods
    .donate(reciever, amount)
    .send({ from: selectedAccount });
};

export const balance = async () => {
  const getContract = await initial();

  return getContract.methods.balance().call({ from: selectedAccount });
};

export const withdraw = async (amount) => {
  const getContract = await initial();

  return getContract.methods.withdraw(amount).send({ from: selectedAccount });
};
