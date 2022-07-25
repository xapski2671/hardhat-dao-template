const { network, ethers } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")
const { moveTime } = require("../utils/move-time")
const { developmentChains, FUNC, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION, MIN_DELAY } = require("../helper-hardhat-config")

async function queueAndExecute()
{
  // to queue the notion Igovernortimelockcontrol.sol passes the
  // proposal to timelock through the queue function
  const args = [NEW_STORE_VALUE]
  const box = await ethers.getContract("Box")
  const encodedFunctionCall = await box.interface.encodeFunctionData(FUNC, args)
  // unlike propose the queue function uses a hash of the proposal description rather 
  // than the string itself
  const descriptionHash = await ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))

  const governor = await ethers.getContract("GovernorContract")
  console.log("Queueing...")

  const queueTx = await governor.queue([box.address], [0], [encodedFunctionCall], descriptionHash)
  await queueTx.wait(1)

  if(developmentChains.includes(network.name))
  {
    // v timelock control uses time
    await moveTime(MIN_DELAY)
    await moveBlocks(1)
    //  ^ we mine the blocks manually
  }


  console.log("Executing...")
  const executeTx = await governor.execute([box.address], [0], [encodedFunctionCall], descriptionHash)
  await executeTx.wait(1)

  const boxNewValue = await box.retrieve()
  console.log(boxNewValue.toString())
}

queueAndExecute()
  .then(()=>{process.exit(0)})
  .catch((e)=>{
    console.log(e)
    process.exit(1)
  })