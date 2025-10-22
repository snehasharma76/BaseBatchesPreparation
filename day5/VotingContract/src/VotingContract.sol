// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title VotingContract
 * @dev A decentralized voting system that allows approved proposers to create proposals
 * and enables anyone to vote on them. The contract owner manages proposer permissions.
 */
contract VotingContract{

    /**
     * @dev Proposal structure containing all proposal data
     * @param description The text description of the proposal
     * @param yesVotes Number of votes in favor
     * @param noVotes Number of votes against
     * @param active Whether the proposal is currently active for voting
     * @param endTime Unix timestamp when voting ends
     * @param approved Final result after proposal is closed (true if yesVotes > noVotes)
     */
    struct Proposal{
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        bool active;
        uint256 endTime;
        bool approved;
    }

    // State variables
    Proposal[] public proposals; // Array storing all proposals
    mapping(uint256 => mapping(address => bool)) public hasVoted; // Track if an address has voted on a proposal
    mapping(address => bool) public isApprovedProposer; // Track approved proposers
    address public owner; // Contract owner address

    // Events
    event ProposalCreated(uint256 proposalId, string description, uint256 endTime);
    event VoteCast(uint256 proposalId, address voter);
    event ProposalClosed(uint256 proposalId, bool approved);
    event ProposerApproved(address proposer);
    event ProposerRemoved(address proposer);

    /**
     * @dev Constructor sets the deployer as owner and automatically approves them as a proposer
     */
    constructor(){
        owner = msg.sender;
        isApprovedProposer[owner] = true;
    }

    /**
     * @dev Modifier to restrict function access to only the contract owner
     */
    modifier onlyOwner(){
        require(msg.sender == owner, "Not authorized");
        _;
    }

    /**
     * @dev Modifier to restrict function access to only approved proposers
     */
    modifier onlyApprovedProposer(){
        require(isApprovedProposer[msg.sender],"Not an approved Proposer");
        _;
    }

    /**
     * @dev Approve an address to create proposals
     * @param _proposer Address to be approved as a proposer
     * @notice Only the contract owner can call this function
     */
    function approveProposer(address _proposer) public onlyOwner{
        isApprovedProposer[_proposer] = true;
        emit ProposerApproved(_proposer);
    }

    /**
     * @dev Remove proposer privileges from an address
     * @param _proposer Address to be removed as a proposer
     * @notice Only the contract owner can call this function
     */
    function removeProposer(address _proposer) public onlyOwner{
        isApprovedProposer[_proposer] = false;
        emit ProposerRemoved(_proposer);
    }

    /**
     * @dev Create a new proposal
     * @param _description Text description of the proposal
     * @param _duration Duration in seconds for how long voting will be active
     * @return proposalId The ID of the newly created proposal
     * @notice Only approved proposers can create proposals
     */
    function createProposal(string memory _description, uint256 _duration) public onlyApprovedProposer returns(uint256){
        uint _endTime = block.timestamp + _duration;
        Proposal memory newProposal = Proposal({
         description: _description,
         yesVotes: 0,
         noVotes: 0,
         active: true,
         endTime: _endTime,
         approved: false
        });

        proposals.push(newProposal);
        uint256 proposalId = proposals.length - 1;
        emit ProposalCreated(proposalId, _description, _endTime);
        return proposalId;
    }

    /**
     * @dev Cast a vote on a proposal
     * @param _proposalId The ID of the proposal to vote on
     * @param _vote True for yes, false for no
     * @notice Each address can only vote once per proposal
     * @notice Voting is only allowed while the proposal is active and before endTime
     */
    function vote(uint256 _proposalId, bool _vote) public{
        require(_proposalId < proposals.length,"Proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.active,"Proposal is not active");
        require(block.timestamp < proposal.endTime, "Voting ended");
        require(!hasVoted[_proposalId][msg.sender],"Already Voted");

        hasVoted[_proposalId][msg.sender] = true;
        if(_vote){
            proposal.yesVotes++;
        }else{
            proposal.noVotes++;
        }

        emit VoteCast(_proposalId, msg.sender);
    }

    /**
     * @dev Close a proposal after voting period ends
     * @param _proposalId The ID of the proposal to close
     * @notice Can only be called after the proposal's endTime has passed
     * @notice Sets the approved status based on whether yesVotes > noVotes
     */
    function closeProposal(uint256 _proposalId) public{
        require(_proposalId < proposals.length,"Proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.active,"Proposal is not active");
        require(block.timestamp >= proposal.endTime, "Voting ongoing");

        proposal.active = false;
        proposal.approved = proposal.yesVotes > proposal.noVotes;
        emit ProposalClosed((_proposalId), proposal.approved);
    }

    /**
     * @dev Get details of a specific proposal
     * @param _proposalId The ID of the proposal to query
     * @return description The proposal description
     * @return yesVotes Number of yes votes
     * @return noVotes Number of no votes
     * @return active Whether the proposal is active
     * @return endTime Unix timestamp when voting ends
     * @return approved Whether the proposal was approved (only meaningful after closing)
     */
    function getProposal(uint256 _proposalId) public view returns(
        string memory description,
        uint256 yesVotes,
        uint256 noVotes,
        bool active,
        uint256 endTime,
        bool approved
    ) {
        require(_proposalId < proposals.length,"Proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        return(
            proposal.description,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.active,
            proposal.endTime,
            proposal.approved
        );
    }

    /**
     * @dev Get the total number of proposals
     * @return The total count of proposals created
     */
    function getProposalCount() public view returns(uint256) {
        return proposals.length;
    }
}