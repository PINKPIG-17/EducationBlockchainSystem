const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  // 获取部署者的账户信息
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // 获取 Process 合约的工厂
  const ProcessFactory = await ethers.getContractFactory("Process");

  // 部署合约
  const process = await ProcessFactory.deploy();

  // 等待合约部署完成
  await process.deployTransaction.wait(); // 等待交易确认

  // 确保合约地址已成功设置
  if (process.address) {
    console.log("Process contract deployed to:", process.address);
  } else {
    console.error("Failed to retrieve the contract address.");
  }
}

// 捕获错误并退出
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });
