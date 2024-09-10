// Setup: npm install alchemy-sdk
const { Network, Alchemy } =require ("alchemy-sdk") 

// Optional config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: "U0dK0spERJyBbs8DILZ643QoBe2WbHKg", // Replace with your Alchemy API Key.
  network: Network.ETH_SEPOLIA, // Replace with your network.
};

const alchemy = new Alchemy(settings);

// Fetch block information
alchemy.core.getBlock(15221026).then(console.log).catch(console.error);