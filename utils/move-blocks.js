const { network } = require("hardhat")

function sleep(timeInMs)
{
  return new Promise((resolve)=>{setTimeout(resolve, timeInMs)})
  // ^ mimicing an actual blockchain by creating a delay between two mined blocks
}

async function moveBlocks(amount, sleepTime = 0) // sleep time is 0 by default
{
  console.log("Moving Blocks...")
  for(let i = 0; i < amount; i++)
  {
    await network.provider.request(
      {
        method: "evm_mine",
        params: []
      }
    )
    if(sleepTime > 0)
    {
      console.log(`Sleeping for ${sleepTime}ms`)
      await sleep(sleepTime)
    }
  }
}

module.exports = { moveBlocks, sleep }