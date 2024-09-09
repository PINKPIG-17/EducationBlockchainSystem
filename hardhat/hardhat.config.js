require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.alchemyapi.io/v2/U0dK0spERJyBbs8DILZ643QoBe2WbHKg`, // 使用你的 Alchemy API Key
      accounts: [`0x65505be72697980a6021ff83b2efa5381b8cb77c08b1bcd2d11c0d7582aa8be0`], // 确保在 .env 文件中设置 PRIVATE_KEY
    },
  },
};