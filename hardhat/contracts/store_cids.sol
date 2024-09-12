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
    returns (CID[] memory) {
        require(_receiver == msg.sender, "You are not the owner!");
        return cids[_receiver];
    }

    function deleteCid(address _receiver, uint index) 
    public {
        require(index < cids[_receiver].length, "Invalid Index");
        require(_receiver == msg.sender, "You are not the owner!");

        string memory cidToDelete = cids[_receiver][index].cid;

        cids[_receiver][index] = cids[_receiver][cids[_receiver].length - 1];
        cids[_receiver].pop();

        emit DeleteCID(_receiver, cidToDelete);
    }
}
