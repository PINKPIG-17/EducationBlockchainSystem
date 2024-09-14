// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StoreCIDs {
    struct CID {
        string cid;
        address sender;
        uint256 timestamp;
        bytes32 digest;
    }

    event StoreCID(address indexed receiver, string cid, address sender, bytes32 digest, uint256 timestamp);
    event DeleteCID(address indexed receiver, string cid);

    mapping(address => CID[]) public cids;

    function storeFile(string memory _cid,bytes32 _digest, address _receiver) 
    public {
        CID memory newCid = CID({
            cid: _cid,
            digest : _digest,
            sender: msg.sender,
            timestamp: block.timestamp
        });

        cids[_receiver].push(newCid);

        emit StoreCID(_receiver, _cid, msg.sender, _digest, block.timestamp);
    }

    function getFiles(address _receiver)
        public
        view
        returns (string[] memory _cids, address[] memory _senders, uint256[] memory _timestamps, bytes32[] memory _digests)
    {
        uint256 fileCount = cids[_receiver].length;
        _cids = new string[](fileCount);
        _senders = new address[](fileCount);
        _timestamps = new uint256[](fileCount);
        _digests = new bytes32[](fileCount);

        for (uint256 i = 0; i < fileCount; i++) {
            CID memory file = cids[_receiver][i];
            _cids[i] = file.cid;
            _senders[i] = file.sender;
            _timestamps[i] = file.timestamp;
            _digests[i] = file.digest;
        }
        return (_cids, _senders, _timestamps, _digests);
    }

    function deleteCid(address _sender,string memory cidToDelete) 
    public {
        require(msg.sender ==_sender,"You are not owner");
        CID[] storage userCIDs = cids[msg.sender];
        bool found = false;
        
        for (uint i = 0; i < userCIDs.length; i++) {
            if (keccak256(abi.encodePacked(userCIDs[i].cid)) == keccak256(abi.encodePacked(cidToDelete))) {
                userCIDs[i] = userCIDs[userCIDs.length - 1];
                userCIDs.pop(); 
                found = true;
                emit DeleteCID(msg.sender, cidToDelete);
                break;
            }
        }

        require(found, "CID not found for the sender");
    }
}
