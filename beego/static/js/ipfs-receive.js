const ipfs = window.IpfsHttpClient.create({
  host: 'localhost',
  port: '5001',
  protocol: 'http'
});

// StoreCIDs 和 receiveCids 合约的地址和 ABI
const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/your-alchemy-api-key');

const storeContractAddress = '0xabD2c01a0D4110c1901D71e348644CA3A98B190b';  // 替换为 StoreCIDs 合约地址
const storeContractAbi = [
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


const receiveContractAddress = '0x81B7D513C037DA91E07bF0534875664a4b0eae41';  // 替换为 receiveCids 合约地址
const receiveContractAbi = [
    {
        "inputs": [
            { "internalType": "address", "name": "_sender", "type": "address" }
        ],
        "name": "getUserInfo",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "signature", "type": "string" },
                    { "internalType": "bytes32", "name": "hashData", "type": "bytes32" },
                    { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
                ],
                "internalType": "struct receiveCids.userInfo[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "_sender", "type": "address" },
            { "internalType": "bytes32", "name": "_hashData", "type": "bytes32" },
            { "internalType": "string", "name": "_signature", "type": "string" }
        ],
        "name": "storeUserInfo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

if (typeof window.ethereum === 'undefined') {
    console.error('请先安装MetaMask');
    alert('请先安装MetaMask');
}

// 从合约读取 CID 和 Digest 的函数
async function getFilesFromContract() {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await ensureCorrectNetwork(provider); // Ensure you're on the correct network (Sepolia)

        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const contract = new ethers.Contract(storeContractAddress, storeContractAbi, signer);

        // Call the getFiles function on the contract
        const files = await contract.getFiles(userAddress);
        console.log('Files:', files);

        // Display the files on the page
        displayFiles(files);
    } catch (error) {
        console.error('Error fetching files:', error);

        if (error.code === 'CALL_EXCEPTION') {
            alert('Error in contract call, please check the contract and function name.');
        } else {
            alert('Error fetching files: ' + error.message);
        }
    }
}

async function sigFile(cid) {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // 获取当前用户的地址
        const userAddress = await signer.getAddress();

        // 调用合约，获取用户文件列表
        const contract = new ethers.Contract(storeContractAddress, storeContractAbi, signer);
        const [cids, senders, timestamps, digests] = await contract.getFiles(userAddress);  // 获取多个数组

        // 查找与传入的 CID 匹配的文件索引
        const fileIndex = cids.findIndex(c => c === cid);
        if (fileIndex === -1) {
            alert('未找到与此 CID 匹配的文件');
            return;
        }

        // 获取文件的发送者地址（根据文件索引获取）
        const senderAddress = senders[fileIndex];

        // 获取该文件的哈希值
        const digest = digests[fileIndex];

        // 使用当前签名者签署哈希值
        const signature = await signer.signMessage(ethers.toUtf8Bytes(digest));

        //将数据发给后端
        await sendToSQL(cid, senderAddress, signature, digest);

        // 使用 receiveContract 调用 storeUserInfo 函数，将签名、哈希等信息存储到合约
        const receiveContract = new ethers.Contract(receiveContractAddress, receiveContractAbi, signer);
        const tx = await receiveContract.storeUserInfo(senderAddress, digest, signature);
        await tx.wait();  // 等待交易确认

        // 反馈给用户成功信息
        console.log('文件签名已成功存储');
        alert('文件签名成功');

        // 删除已签名的文件
        await deleteCid(cid, userAddress);
        console.log('文件记录已删除');
    } catch (error) {
        console.error('签名存储失败:', error);
        alert(`签名存储失败: ${error.message}`);
    }
}


async function ensureCorrectNetwork(provider) {
    const network = await provider.getNetwork();
    console.log('Connected network:', network.chainId);

    if (network.chainId !== 11155111) { // Sepolia network chainId
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }], // Hexadecimal chainId for Sepolia
            });
            console.log('Switched to Sepolia network');
        } catch (switchError) {
            if (switchError.code === 4902) {
                alert('请在 MetaMask 中添加 Sepolia 测试网络');
            } else {
                console.error('Failed to switch network:', switchError);
                alert('切换网络失败，请手动切换到 Sepolia 测试网络');
            }
            throw switchError;
        }
    }
}

function displayFiles(files) {
    const fileListElement = document.getElementById('fileList');

    // Clear the previous content
    fileListElement.innerHTML = '';

    if (!files || files.length === 0) {
        fileListElement.innerHTML = '<p>No files found.</p>';
        return;
    }

    // Create a table to display files
    const table = document.createElement('table');

    // Table headers
    const headerRow = document.createElement('tr');
    const headers = ['CID', 'Sender', 'Timestamp', 'Digest'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.innerText = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Add rows to the table for each file
    files.forEach(file => {
        const row = document.createElement('tr');

        // CID
        const cidCell = document.createElement('td');
        cidCell.innerText = file.cid;
        row.appendChild(cidCell);

        // Sender
        const senderCell = document.createElement('td');
        senderCell.innerText = file.sender;
        row.appendChild(senderCell);

        // Timestamp
        const timestampCell = document.createElement('td');
        const date = new Date(Number(file.timestamp) * 1000);
        timestampCell.innerText = date.toLocaleString();
        row.appendChild(timestampCell);

        // Digest
        const digestCell = document.createElement('td');
        digestCell.innerText = file.digest;
        row.appendChild(digestCell);

        table.appendChild(row);
    });

    fileListElement.appendChild(table);
}

async function getFileFromIPFS(cid) {
    try {
        // 1. 从 IPFS 获取文件内容
        const stream = ipfs.cat(cid);
        let fileContent = '';
        for await (const chunk of stream) {
            fileContent += new TextDecoder().decode(chunk);
        }

        // 2. 显示文件内容到页面
        document.getElementById('fileContent').innerText = fileContent;

        // 3. 获取合约中的 CID 摘要进行验证
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const contract = new ethers.Contract(storeContractAddress, storeContractAbi, signer);

        // 获取合约中用户的文件记录，解构出各个数组
        const [cids, senders, timestamps, digests] = await contract.getFiles(userAddress);

        // 查找 CID 对应的索引
        const fileIndex = cids.findIndex(c => c === cid);
        if (fileIndex === -1) {
            alert('CID 不存在，请检查 CID 输入');
            return;
        }

        // 获取对应的文件信息
        const expectedDigest = digests[fileIndex];
        const actualDigest = ethers.keccak256(ethers.toUtf8Bytes(fileContent));

        // 文件完整性验证
        if (actualDigest === expectedDigest) {
            console.log('文件完整性验证通过');
            document.getElementById('signButton').style.display = 'inline-block';
            document.getElementById('rejectButton').style.display = 'inline-block';

            // 通过 dataset 保存 CID 和 senderAddress
            document.getElementById('signButton').dataset.cid = cid;
            document.getElementById('signButton').dataset.sender = senders[fileIndex];
            document.getElementById('rejectButton').dataset.cid = cid;
        } else {
            console.error('文件摘要不匹配，文件可能被篡改');
            const confirmDelete = confirm('文件摘要不匹配，文件可能被篡改。是否删除文件记录？');
            if (confirmDelete) {
                await deleteCid(cid, userAddress);
                alert('文件记录已删除');
            } else {
                alert('文件记录未删除');
            }
        }
    } catch (error) {
        console.error('获取文件或验证失败:', error);
    }
}


async function storeUserInfo(senderAddress, cid, signature) {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(receiveContractAddress, receiveContractAbi, signer)

        const digest = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(cid))

        // 调用合约存储用户信息
        const tx = await contract.storeUserInfo(senderAddress, digest, signature)
        await tx.wait()
        console.log('用户信息存储成功')
    } catch (error) {
        console.error('存储用户信息失败:', error)
    }
}

//拒绝签名
function rejectSignature(cid, userAddress) {
    const confirmDelete = confirm('您拒绝签名，是否确认删除该文件？')
    if (confirmDelete) {
        deleteCid(cid, userAddress)
    }
}

async function deleteCid(cid, userAddress) {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(storeContractAddress, storeContractAbi, signer);

        console.log(`尝试删除 CID: ${cid}，用户地址: ${userAddress}`);
        const tx = await contract.deleteCid(userAddress, cid);
        await tx.wait();  // 等待交易确认
        console.log('CID 删除成功');
        alert('文件已删除');
    } catch (error) {
        console.error('删除 CID 失败:', error);
        alert(`删除失败: ${error.message}`);
    }
}

window.onload = function() {
    // 绑定“加载用户文件”按钮的点击事件
    document.getElementById('loadUserFilesButton').addEventListener('click', async () => {
        try {
            // 获取 provider 和 signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();

            // 调用合约的 getFiles 函数
            const contract = new ethers.Contract(storeContractAddress, storeContractAbi, signer);
            const [cids, senders, timestamps, digests] = await contract.getFiles(userAddress);

            // 清空之前的文件列表
            const fileListElement = document.getElementById('userFilesList');
            fileListElement.innerHTML = '';

            // 重新构建文件列表
            if (cids.length === 0) {
                fileListElement.innerHTML = '<li>当前没有文件记录。</li>';
            } else {
                for (let i = 0; i < cids.length; i++) {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                <strong>CID:</strong> ${cids[i]}<br>
                <strong>Sender:</strong> ${senders[i]}<br>
                <strong>Timestamp:</strong> ${new Date(Number(timestamps[i]) * 1000).toLocaleString()}<br>
                <strong>Digest:</strong> ${digests[i]}<br>
            `;
                    fileListElement.appendChild(listItem);
                }
            }

        } catch (error) {
            console.error('获取文件记录失败:', error);
            alert(`文件记录加载失败: ${error.message}`);
        }
    });

    // 绑定“获取并验证文件”按钮的点击事件
    document.getElementById('getFileButton').addEventListener('click', async () => {
        const cid = document.getElementById('cidInput').value;
        if (cid) {
            await getFileFromIPFS(cid);
        } else {
            alert('请输入 CID');
        }
    });

    // 绑定“签名文件”按钮的点击事件
    document.getElementById('signButton').addEventListener('click', async () => {
        const cid = document.getElementById('signButton').dataset.cid;
        const senderAddress = document.getElementById('signButton').dataset.sender;
        await sigFile(cid, senderAddress);
    });

    // 绑定“拒绝签名”按钮的点击事件
    document.getElementById('rejectButton').addEventListener('click', () => {
        const cid = document.getElementById('rejectButton').dataset.cid;
        const userAddress = document.getElementById('userAddress').value;
        rejectSignature(cid, userAddress);
    });
};

// 从 IPFS 获取原文的函数
async function getText(cid) {
    try {
        // 从 IPFS 获取文件内容
        const stream = ipfs.cat(cid);
        let fileContent = '';
        for await (const chunk of stream) {
            fileContent += new TextDecoder().decode(chunk);
        }

        return fileContent;  // 返回获取到的文件原文
    } catch (error) {
        console.error('从 IPFS 获取原文失败:', error);
        throw new Error('从 IPFS 获取原文失败');
    }
}

// 将原文加密并存入后端的函数
async function sendToSQL(cid, senderAddress, signature, digest) {
    try {
        // 调用 getText 获取原文
        const originalText = await getText(cid);

        // 使用发送者的公钥对原文进行加密
        const encryptedText = await encryptWithSenderPublicKey(senderAddress, originalText);

        // 发送加密后的原文、发送者地址、签名和摘要到后端
        await fetch('/store-encrypted-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cid,
                encryptedText,
                senderAddress,
                signature,
                digest,
            }),
        });

        console.log('加密后的原文已成功存储到后端');
    } catch (error) {
        console.error('存储加密后的原文失败:', error);
        throw new Error('存储加密后的原文失败');
    }
}

//公钥加密
const EC = elliptic.ec;
const ec = new EC('secp256k1');

async function encryptWithSenderPublicKey(senderAddress, message) {
    try {
        // 调用 getPublicKeyFromSenderAddress 获取公钥
        const publicKeyHex = await getPublicKeyFromSenderAddress(senderAddress);

        // 将公钥转换为 elliptic 公钥对象
        const publicKey = ec.keyFromPublic(publicKeyHex.slice(2), 'hex').getPublic();

        // 使用公钥生成共享密钥
        const sharedKey = ec.genKeyPair().derive(publicKey);

        // 将消息编码为十六进制
        const encodedMessage = Buffer.from(message).toString('hex');

        // 使用共享密钥进行简单的 XOR 加密
        const encryptedMessage = (BigInt('0x' + encodedMessage) ^ BigInt(sharedKey.toString(16))).toString(16);

        // 返回加密后的消息
        return encryptedMessage;
    } catch (error) {
        console.error('加密失败:', error);
        throw new Error(`加密失败: ${error.message}`);
    }
}


async function getPublicKeyFromSenderAddress(senderAddress) {
    try {
        // 创建 BrowserProvider
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // 请求用户授权并连接 MetaMask
        await provider.send("eth_requestAccounts", []);
        
        // 获取签名者（MetaMask 当前账户）
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        if (userAddress.toLowerCase() !== senderAddress.toLowerCase()) {
            throw new Error("当前用户地址与提供的 senderAddress 不匹配");
        }

        // 定义签名消息（可以是任意消息，用来从签名中提取公钥）
        const message = "Get public key from MetaMask";

        // 请求用户签名消息
        const signature = await signer.signMessage(message);

        // 从签名中恢复公钥
        const publicKeyHex = ethers.utils.recoverPublicKey(ethers.hashMessage(message), signature);

        console.log("恢复的公钥:", publicKeyHex);
        return publicKeyHex;  // 返回公钥
    } catch (error) {
        console.error('获取公钥失败:', error);
        throw new Error(`获取公钥失败: ${error.message}`);
    }
}