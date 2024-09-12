// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract receiveCids {
    struct userInfo {
        string signature;
        bytes32 hashData;
        uint timestamp;
    }

    // 映射: 地址到用户信息数组
    mapping(address => userInfo[]) public users;

    function storeUserInfo(address _sender, bytes32 _hashData, string memory _signature) 
    external {
        userInfo memory newUser = userInfo({
            signature: _signature,
            hashData: _hashData,
            timestamp : block.timestamp
        });

        // 将用户信息存入映射
        users[_sender].push(newUser);
    }

    // 获取用户信息
    function getUserInfo(address _sender) 
    external 
    view 
    returns (userInfo[] memory) {
        return users[_sender];
    }
}
