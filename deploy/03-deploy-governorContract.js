const { network, ethers } = require ("hardhat")
const { developmentChains, VOTING_DELAY, VOTING_PERIOD, QUOROM_PERCENTAGE } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function (hre)
{
  const { deployments, getNamedAccounts } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()

  const governanceToken = await get("GovernanceToken") // gets it from deployments
  const timeLock = await get("TimeLock")

  log("===========================================")

  const args = [governanceToken.address, timeLock.address, VOTING_DELAY, VOTING_PERIOD, QUOROM_PERCENTAGE]

  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1
  })

  if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY)
  {
    log("Verifying...")
    await verify(governorContract.address, args)
  }

  log("===========================================")
}

module.exports.tags = ["all", "governorcontract"]