const { network, ethers } = require ("hardhat")
const { developmentChains, MIN_DELAY } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function (hre)
{
  const { deployments, getNamedAccounts } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("===========================================")

  const args = [MIN_DELAY, [], []]

  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1
  })

  if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY)
  {
    log("Verifying...")
    await verify(timeLock.address, args)
  }

  log("===========================================")
}

module.exports.tags = ["all", "timelock"]