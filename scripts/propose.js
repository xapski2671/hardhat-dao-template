const { developmentChains, 
  NEW_STORE_VALUE, FUNC, 
  PROPOSAL_DESCRIPTION, VOTING_DELAY,
  PROPOSALS_FILE 
} = require("../helper-hardhat-config")
const { moveBlocks, sleep } = require("../utils/move-blocks")
const { ethers, network } = require("hardhat")
const fs = require("fs")

// here we propose that the box contract stores the number 77
async function propose(functionToCall, args, proposalDescription)
{
  const governor = await ethers.getContract("GovernorContract")
  const box = await ethers.getContract("Box")
  // functions on the box contract are called though governor using calldata func sig and selector
  const encodedFunctionCall = await box.interface.encodeFunctionData(functionToCall, args)
  console.log(encodedFunctionCall)
  console.log(`Proposing ${functionToCall} on ${box.address} with parameters: ${args}`)
  console.log(`Proposal Description: \n ${proposalDescription}`)
  // now proposing...
  const proposeTx = await governor.propose([box.address], [0], [encodedFunctionCall], proposalDescription)
  // (targets, value, function call data description)
  if(developmentChains.includes(network.name))
  {
    await moveBlocks(VOTING_DELAY + 1, (sleepTime = 1000))
    // we mine the blocks manually
  }
  const proposeTxR = await proposeTx.wait(1)

  const proposalId = proposeTxR.events[0].args.proposalId
  // ^ we're going to need the proposal id when we want to vote
  // ^ event[0] also gives details like deadline and snaphots etc
  // all our proposals are going to be stored in ../proposals.json
  let proposals = JSON.parse(await fs.readFileSync(PROPOSALS_FILE, "utf8"))
  proposals[network.config.chainId.toString()].push(proposalId.toString())
  // ^ recording chainId and proposalId
  // ^ keep in mind we have already made key 31337 with an empty array wai
  // ting to be updated
  await fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals))

  const proposalState = await governor.state(proposalId)
  const proposalSnapShot = await governor.proposalSnapshot(proposalId)
  const proposalDeadline = await governor.proposalDeadline(proposalId)
  // proposal state 1 means its active
  console.log(`Current Proposal State: ${proposalState}`)
  // What block # the proposal was snapshot,
  // the contract took a snapshot of evryone and the number of tokens they had at that block
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
  // The block number the proposal voting expires at block number:
  console.log(`Current Proposal Deadline: ${proposalDeadline}`)
}

propose(FUNC, [NEW_STORE_VALUE], PROPOSAL_DESCRIPTION)
  .then(()=>{process.exit(0)})
  .catch((e)=>{
    console.log(e)
    process.exit(1)
  })

module.exports = { propose }