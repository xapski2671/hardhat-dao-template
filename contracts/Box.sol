// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable 
{
  uint256 internal value;

  event ValueChanged(uint256 newValue_);

  function store(uint256 newValue_) public onlyOwner
  { // ^ the owner is the DAO
    value = newValue_;
    emit ValueChanged(newValue_);
  }

  function retrieve() public view returns(uint256)
  {
    return value;
  }
}