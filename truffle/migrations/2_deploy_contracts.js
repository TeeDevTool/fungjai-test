var MySocial = artifacts.require("../contracts/MySocial.sol");

module.exports = function (deployer) {
  deployer.deploy(MySocial, { value: 20000000000000000000 });
};
