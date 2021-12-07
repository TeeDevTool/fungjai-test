// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
pragma abicoder v2;

contract MySocial {
    
    address public owner;
    uint16 private accountCount;
    string[] private posts;

    struct Feeds {
        string name;
        string caption;
        address account;
    }

    Feeds[] private feeds;

    mapping (address => uint) private accountBalance;
    mapping (string => address) private accountAddress; 
    mapping (address => string) private accountName;
    mapping (uint => address) private postAccount;

    constructor() payable {
        // require initial ether 
        require(msg.value == 20 ether, "initial ether not anough");
        // set owner address
        owner = msg.sender;
        // account's counter begin counting
        accountCount = 0;
    }

    function register(string memory _accountName) public returns (uint) {
        // first 5 account will get 4 ether init 
        if (accountCount < 5) {
            accountCount++;
            accountBalance[msg.sender] = 4 ether;
        }
        accountAddress[_accountName] = msg.sender;
        accountName[msg.sender] = _accountName;
        return accountBalance[msg.sender];
    }

    function getAccountName() public view returns (string memory) {
        return accountName[msg.sender];
    }

    function feed() public view returns (Feeds[] memory) {
        return feeds;
    }

    function post(string memory _name, string memory _caption) public returns (uint) {
        feeds.push(Feeds(_name, _caption, accountAddress[_name]));
        // return last feeds
        return feeds.length - 1;
    }   

    function donate(address _reciever, uint _amount) public returns (uint) {
        // transfer ether from sender to reciever 
        accountBalance[msg.sender] -= _amount;
        accountBalance[_reciever] += _amount;
        
        return accountBalance[msg.sender];
    }

    function balance() public view returns (uint) {
        // get account balance
        return accountBalance[msg.sender];
    }

    function withdraw(uint _amount) public returns (uint) {
        uint _withdrawAmount = _amount * 9 / 10;
        accountBalance[msg.sender] -= _amount;
        payable(msg.sender).transfer(_withdrawAmount);
        return _withdrawAmount;
    }

}