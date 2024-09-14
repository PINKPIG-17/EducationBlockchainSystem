    const ipfs = window.IpfsHttpClient.create({
        host: 'localhost',
        port: '5001',
        protocol: 'http'
    });

// 合约的地址和 ABI
    const jsonRpcProvider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/U0dK0spERJyBbs8DILZ643QoBe2WbHKg')
    const contractAddress ='0xabD2c01a0D4110c1901D71e348644CA3A98B190b';
    const contractAbi = [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "receiver",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "cid",
                        "type": "string"
                    }
                ],
                "name": "DeleteCID",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "receiver",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "cid",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "bytes32",
                        "name": "digest",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "name": "StoreCID",
                "type": "event"
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
                "name": "cids",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "cid",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "digest",
                        "type": "bytes32"
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
                        "internalType": "string",
                        "name": "cidToDelete",
                        "type": "string"
                    }
                ],
                "name": "deleteCid",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_receiver",
                        "type": "address"
                    }
                ],
                "name": "getFiles",
                "outputs": [
                    {
                        "internalType": "string[]",
                        "name": "_cids",
                        "type": "string[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "_senders",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "_timestamps",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes32[]",
                        "name": "_digests",
                        "type": "bytes32[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_cid",
                        "type": "string"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "_digest",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "_receiver",
                        "type": "address"
                    }
                ],
                "name": "storeFile",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]

    // 返回上传结果的CID和Digest
    async function uploadToIPFS() {
        const fileInput = document.getElementById('fileInput');
        const files = fileInput.files;

        if (!files.length) {
            console.log('请选择文件上传！');
            return;
        }

        if (files.length > 1) {
            console.log('仅能上传一个文件！');
            return;
        }

        const file = files[0];

        try {
            const reader = new FileReader();

            return new Promise((resolve, reject) => {
                reader.onload = async function (event) {
                    const arrayBuffer = event.target.result;
                    const textContent = new TextDecoder().decode(arrayBuffer);
                    const digest = ethers.keccak256(ethers.toUtf8Bytes(textContent));
                    const textBlob = new Blob([textContent], { type: 'text/plain' });
                    const added = await ipfs.add(textBlob, { pin: true });

                    const cid = added.cid.toString();
                    resolve({ cid, digest });
                };

                reader.onerror = (error) => reject(error);
                reader.readAsArrayBuffer(file);
            });
        } catch (error) {
            console.error('文件上传失败！', error);
        }
    }

    // 调用智能合约，存储 CID 和摘要
    async function storeCIDOnChain(userAddress, signer, cid, digest) {
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);
        console.log(contract);

        try {
            const tx = await contract.storeFile(cid, digest, userAddress);
            console.log('Transaction Hash:', tx.hash);
            await tx.wait(); // 等待交易确认
            console.log('CID 和摘要成功存储到链上！');
        } catch (error) {
            console.error('存储CID和摘要失败！', error);
        }
    }

    // 检查是否安装MetaMask并连接账户
    async function checkMetaMaskConnection() {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask 已安装!');

            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });

                if (accounts.length === 0) {
                    console.log('MetaMask 未连接，请连接您的账户！');
                    await requestMetaMaskConnection();
                } else {
                    console.log('MetaMask 已连接:', accounts[0]);
                    return accounts[0];
                }
            } catch (error) {
                console.error('无法获取账户信息！', error);
            }
        } else {
            console.error('MetaMask 未安装，请先安装 MetaMask 扩展！');
            alert('请安装 MetaMask 以继续。');
        }
    }

    // 请求MetaMask连接账户
    async function requestMetaMaskConnection() {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('已成功连接 MetaMask:', accounts[0]);
            return accounts[0];
        } catch (error) {
            console.error('用户拒绝连接 MetaMask', error);
        }
    }

async function main() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask 已安装');

        // 在 main 函数中动态获取 provider 和 signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // 继续进行接下来的操作，例如用户连接账户、文件上传和链上存储
        const userAddress = document.getElementById('userAddress').value;
        if (!userAddress) {
            alert('请输入您的地址！');
            return;
        }

        const connectedAddress = await checkMetaMaskConnection();
        if (connectedAddress) {
            try {
                const { cid, digest } = await uploadToIPFS();
                document.getElementById('cidOutput').innerText = `CID: ${cid}`;
                document.getElementById('digestOutput').innerText = `Digest: ${digest}`;

                await storeCIDOnChain(userAddress, signer, cid, digest);
            } catch (error) {
                console.error('操作失败', error);
            }
        } else {
            console.log('MetaMask 未连接，无法继续操作。');
        }
    } else {
        console.error('MetaMask 未安装');
        alert('请安装 MetaMask 扩展程序。');
    }
}