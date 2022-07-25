// here we vote concerning the notion that says no 77 should be stored in box.sol
const { PROPOSALS_FILE, developmentChains, VOTING_PERIOD } = require("../helper-hardhat-config")
const fs = require("fs")
const { network, ethers } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const index = 0 // first item (proposalId) in network 31337 array

async function vote(proposalIndex)
{
  const governor = await ethers.getContract("GovernorContract")

  const proposals = JSON.parse(await fs.readFileSync(PROPOSALS_FILE, "utf8"))
  const proposalId = proposals[network.config.chainId.toString()][proposalIndex]
  // 0 means against the notion 1 means for the notion 2 means 
  // abstain (pretty stupid cuz it still costs gas)
  const voteWay = 1
  const reason = "cuz why not"
  const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason)
  await voteTx.wait(1)

  if(developmentChains.includes(network.name))
  {
    await moveBlocks(VOTING_PERIOD + 1, (sleepTime = 1000))
  }

  const proposalState = await governor.state(proposalId)
  const proposalSnapShot = await governor.proposalSnapshot(proposalId)
  const proposalDeadline = await governor.proposalDeadline(proposalId)
  // The state of the proposal. see IGovernor.sol for proposal states
  console.log(`Current Proposal State: ${proposalState}`)
  // What block # the proposal was snapshot,
  // the contract took a snapshot of evryone and the number of tokens they had at that block
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
  // The block number the proposal voting expires at block number:
  console.log(`Current Proposal Deadline: ${proposalDeadline}`)
}

vote(index)
  .then(()=>{process.exit(0)})
  .catch((e)=>{
    console.log(e)
    process.exit(1)
  })
