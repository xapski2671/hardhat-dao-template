const MIN_DELAY = 3600 // 3600s - 1 hr 

const VOTING_PERIOD = 5 // 5 blocks
const VOTING_DELAY = 1 // 1 block
const QUOROM_PERCENTAGE = 4
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

const NEW_STORE_VALUE = 77
const FUNC = "store"
const PROPOSAL_DESCRIPTION = "Proposal #1: Store 77 in Box.sol"
const PROPOSALS_FILE = "proposals.json" // fs reads from root project dir

const DECIMALS = "18"
const INITIAL_PRICE = "200000000000000000000"
const developmentChains = ["hardhat", "localhost"]



module.exports = 
{
  MIN_DELAY,
  VOTING_PERIOD,
  VOTING_DELAY,
  QUOROM_PERCENTAGE,
  ADDRESS_ZERO,
  NEW_STORE_VALUE,
  FUNC,
  PROPOSAL_DESCRIPTION,
  PROPOSALS_FILE,
  DECIMALS,
  INITIAL_PRICE,
  developmentChains
}