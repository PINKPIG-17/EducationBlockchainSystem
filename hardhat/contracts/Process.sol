// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
contract Process{
    using ECDSA for bytes32;
    using MessageHashUtils for bytes;

    mapping(address => bytes32[]) public transactions;
    // function verifySignature(bytes32 _message, bytes memory _signature,address signer)
    // external
    // pure
    // returns(bool){
    //     //签名验证
    //     bytes32 messageHash =toEthSignedMessageHash(_message);
    //     address _signer =messageHash.recover(_signature);
    //     return signer ==_signer;
    // }

    // function toEthSignedMessageHash(bytes32 _message)
    //  internal
    //  pure 
    //  returns (bytes32) {
    //     // 生成以太坊签名消息的哈希
    //     return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _message));
    // }

    function storeTransaction(address _sender,bytes32 _transaction)
    external{
        //将交易号存在用户下
        //描述信息在数据库中实现
        transactions[_sender].push(_transaction);
    }

    function getTransaction(address _sender)
    external
    view
    returns(bytes32[] memory){
         return transactions[_sender];
    }
}