const { network, ethers } = require ("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function (hre)
{
  const { deployments, getNamedAccounts } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("===========================================")

  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1
  })

  if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY)
  {
    log("Verifying...")
    await verify(governanceToken.address, [])
  }

  log("===========================================")

  await delegate(governanceToken.address, deployer)
  log("Delegated!!")
}

// v we now delegate this token to deployer
const delegate = async (governanceTokenAddress, delegatedAccount)=>
{// who do we want to be able to vote with our token (a function to give my voting tokens to another account)
  const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress)
  const tx = await governanceToken.delegate(delegatedAccount) // delegatedAccount is an address not account obj
  await tx.wait(1)
  console.log(`Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`)
  // ^ checkpoints are points of snapshot of everyones tokens
}


module.exports.tags = ["all", "governancetoken"]