require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28",  // Update this version to match your contract
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};
