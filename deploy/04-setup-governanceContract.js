const { network, ethers } = require ("hardhat")
const { ADDRESS_ZERO } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function (hre)
{
  const { deployments, getNamedAccounts } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()

  const governorContract = await ethers.getContract("GovernorContract", deployer) 
  const timeLock = await ethers.getContract("TimeLock", deployer)

  log("===========================================")
  log("Setting Up Roles...")
  const proposerRole = await timeLock.PROPOSER_ROLE()
  const executorRole = await timeLock.EXECUTOR_ROLE()
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

  const proposerTx = await timeLock.grantRole(proposerRole, governorContract.address)
  await proposerTx.wait(1) // the governor can now propose a notion
  const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
  await executorTx.wait(1) // everybody and anybody can execute a succesful notion
  const revokeTx = await timeLock.revokeRole(adminRole, deployer)
  await revokeTx.wait(1) // the deployer is no longer the admin

  log("===========================================")
}

module.exports.tags = ["all", "governorcontract"]