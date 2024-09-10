import { ethers } from 'https://cdn.ethers.io/lib/ethers-5.2.umd.min.js';

const contractAddress ='0xABe0Bd8eF2989479F36B43848C4F94a2c3578Db9'
const jsonRpcProvider  = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/U0dK0spERJyBbs8DILZ643QoBe2WbHKg')
const contractAbi =[{
  "_format": "hh-sol-artifact-1",
  "contractName": "Process",
  "sourceName": "contracts/Process.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_sender",
          "type": "address"
        }
      ],
      "name": "getTransaction",
      "outputs": [
        {
          "internalType": "bytes32[]",
          "name": "",
          "type": "bytes32[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_sender",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "_transaction",
          "type": "bytes32"
        }
      ],
      "name": "storeTransaction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "transactions",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x608060405234801561001057600080fd5b506104ae806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806314538128146100465780637bb8637914610076578063f79bb70f146100a6575b600080fd5b610060600480360381019061005b919061028b565b6100c2565b60405161006d91906102e4565b60405180910390f35b610090600480360381019061008b91906102ff565b6100f3565b60405161009d91906103ea565b60405180910390f35b6100c060048036038101906100bb9190610438565b610189565b005b600060205281600052604060002081815481106100de57600080fd5b90600052602060002001600091509150505481565b60606000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801561017d57602002820191906000526020600020905b815481526020019060010190808311610169575b50505050509050919050565b6000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190806001815401808255809150506001900390600052602060002001600090919091909150555050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610222826101f7565b9050919050565b61023281610217565b811461023d57600080fd5b50565b60008135905061024f81610229565b92915050565b6000819050919050565b61026881610255565b811461027357600080fd5b50565b6000813590506102858161025f565b92915050565b600080604083850312156102a2576102a16101f2565b5b60006102b085828601610240565b92505060206102c185828601610276565b9150509250929050565b6000819050919050565b6102de816102cb565b82525050565b60006020820190506102f960008301846102d5565b92915050565b600060208284031215610315576103146101f2565b5b600061032384828501610240565b91505092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b610361816102cb565b82525050565b60006103738383610358565b60208301905092915050565b6000602082019050919050565b60006103978261032c565b6103a18185610337565b93506103ac83610348565b8060005b838110156103dd5781516103c48882610367565b97506103cf8361037f565b9250506001810190506103b0565b5085935050505092915050565b60006020820190508181036000830152610404818461038c565b905092915050565b610415816102cb565b811461042057600080fd5b50565b6000813590506104328161040c565b92915050565b6000806040838503121561044f5761044e6101f2565b5b600061045d85828601610240565b925050602061046e85828601610423565b915050925092905056fea2646970667358221220c4a90368dc306c8e446353554bf061ed9c7066bc7a3a5c638deae0dbb3ec0d6164736f6c63430008180033",
  "deployedBytecode": "0x608060405234801561001057600080fd5b50600436106100415760003560e01c806314538128146100465780637bb8637914610076578063f79bb70f146100a6575b600080fd5b610060600480360381019061005b919061028b565b6100c2565b60405161006d91906102e4565b60405180910390f35b610090600480360381019061008b91906102ff565b6100f3565b60405161009d91906103ea565b60405180910390f35b6100c060048036038101906100bb9190610438565b610189565b005b600060205281600052604060002081815481106100de57600080fd5b90600052602060002001600091509150505481565b60606000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801561017d57602002820191906000526020600020905b815481526020019060010190808311610169575b50505050509050919050565b6000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190806001815401808255809150506001900390600052602060002001600090919091909150555050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610222826101f7565b9050919050565b61023281610217565b811461023d57600080fd5b50565b60008135905061024f81610229565b92915050565b6000819050919050565b61026881610255565b811461027357600080fd5b50565b6000813590506102858161025f565b92915050565b600080604083850312156102a2576102a16101f2565b5b60006102b085828601610240565b92505060206102c185828601610276565b9150509250929050565b6000819050919050565b6102de816102cb565b82525050565b60006020820190506102f960008301846102d5565b92915050565b600060208284031215610315576103146101f2565b5b600061032384828501610240565b91505092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b610361816102cb565b82525050565b60006103738383610358565b60208301905092915050565b6000602082019050919050565b60006103978261032c565b6103a18185610337565b93506103ac83610348565b8060005b838110156103dd5781516103c48882610367565b97506103cf8361037f565b9250506001810190506103b0565b5085935050505092915050565b60006020820190508181036000830152610404818461038c565b905092915050565b610415816102cb565b811461042057600080fd5b50565b6000813590506104328161040c565b92915050565b6000806040838503121561044f5761044e6101f2565b5b600061045d85828601610240565b925050602061046e85828601610423565b915050925092905056fea2646970667358221220c4a90368dc306c8e446353554bf061ed9c7066bc7a3a5c638deae0dbb3ec0d6164736f6c63430008180033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}
]
//连接metamask
async function connectMetamask() {
    if(window.ethereum)
    {const provider =new ethers.providers.Web3Provider(window.ethereum)
    try{

      await provider.send('eth_requestAccounts',[])
      return provider.getSigner()
    }catch (error){
      console.log(`用户拒绝连接 MetaMask`)
    }
  }else{
    console.error(`MetaMask未安装`)
  }
}
//获取数据摘要
//接受一个string类型，返回bytes32类型
function hashData(data){
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(data))
}
//加密
function encryptData(data, publicKey) {
    const buffer = Buffer.from(data);
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
}
//签名
async function signMessage(message,signer) {
    return await signer.signMessage(ethers.utils.arrayify(message))
}
//验证签名
async function verifySignature(messageHash,signature,account) {
    const recoverAddress =ethers.utils.verifyMessage(ethers.utils.arrayify(messageHash),signature)

    return recoverAddress.toLowerCase() ===account.account.toLowerCase()
}
//储存交易
async function storeTransaction(contract,account,transactionHash) {
    const tx =await contract.storeTransaction(account,transactionHash)
    await tx.wait()
}

async function main() {
    const signer = await connectMetamask()
    const account =await signer.getAddress()

    //获取的message需转换为string类型
    //pubkey为地址类型
    const message =document.getElementById('messageInput').value
    const userPublicKey =document.getElementById('publicKeyInput').value

    const hashedData =hashData(message)
    console.log(`数据摘要：`,hashedData)

    const signature =await signMessage(hashedData,signer)
    console.log(`签名完成！`)

    const isRightSign =await verifySignature(hashedData,signature,account)
    if(isRightSign){
        console.log(`签名验证通过！`)
    }else{
        console.log(`签名验证失败!`)
    }

    if(isRightSign){
        const contract =new ethers.Contract(contractAddress,contractAbi,signer)//usaer?

        await storeTransaction(contract,userPublicKey,hashedData)
        console.log(`摘要成功上传！`)

        const encryptedData =encryptData(message, userPublicKey)
        //后端获取密文
        // const response = await fetch('YOUR_BACKEND_URL', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         encryptedData: encryptedData
        //     })
        // });
    }else{
        console.log(`签名失败!`)
    }
}

document.getElementById('submitBtn').addEventListener('click', async () => {
    await main();
});

window.addEventListener('load', async () => {
  await connectMetamask() // 自动连接 MetaMask
});