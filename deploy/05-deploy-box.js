// the governed contract
const { network, ethers } = require ("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function (hre)
{
  const { deployments, getNamedAccounts } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("===========================================")

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1
  })

  if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY)
  {
    log("Verifying...")
    await verify(box.address, [])
  }

  log("===========================================")

  // now to give ownership to timelock
  const timeLock = await ethers.getContract("TimeLock")
  const boxContract = await ethers.getContractAt("Box", box.address) // see that is not being called by deployer
  const transferOwnershipTx = await boxContract.transferOwnership(timeLock.address)
  await transferOwnershipTx.wait(1)
  log("...ownership transferred!")
}

module.exports.tags = ["all", "box"]