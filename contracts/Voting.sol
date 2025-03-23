// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockchainVoting {
    address public admin;
    mapping(address => bool) public hasVoted;
    mapping(address => bool) public isRegistered;
    mapping(string => uint256) public votes;
    mapping(string => bool) private candidateExists;
    string[] public candidates;
    address[] private registeredVoters;
    uint256 public totalVoters;
    uint256 public totalVotes;

    event VoterRegistered(address voter);
    event VoteCasted(address voter, string candidate);
    event CandidateAdded(string candidate);
    event CandidateRemoved(string candidate);
    event VotesReset();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action!");
        _;
    }

    modifier onlyRegistered() {
        require(isRegistered[msg.sender], "You must be registered to vote!");
        _;
    }

    constructor(string[] memory _candidates) {
        admin = msg.sender;
        for (uint i = 0; i < _candidates.length; i++) {
            candidates.push(_candidates[i]);
            candidateExists[_candidates[i]] = true;
        }
    }

    function registerVoter() public {
        require(!isRegistered[msg.sender], "Already registered!");
        isRegistered[msg.sender] = true;
        registeredVoters.push(msg.sender);
        totalVoters++;
        emit VoterRegistered(msg.sender);
    }

    function vote(string memory _candidate) public onlyRegistered {
        require(!hasVoted[msg.sender], "You have already voted!");
        require(candidateExists[_candidate], "Invalid candidate!");

        votes[_candidate]++;
        hasVoted[msg.sender] = true;
        totalVotes++;

        emit VoteCasted(msg.sender, _candidate);
    }

    function getVotes(string memory _candidate) public view returns (uint256) {
        return votes[_candidate];
    }

    function getTotalVotes() public view returns (uint256) {
        return totalVotes;
    }

    function addCandidate(string memory _candidate) public onlyAdmin {
        require(!candidateExists[_candidate], "Candidate already exists!");
        candidates.push(_candidate);
        candidateExists[_candidate] = true;
        emit CandidateAdded(_candidate);
    }

    function removeCandidate(string memory _candidate) public onlyAdmin {
        require(candidateExists[_candidate], "Candidate not found!");

        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(abi.encodePacked(candidates[i])) == keccak256(abi.encodePacked(_candidate))) {
                candidates[i] = candidates[candidates.length - 1];
                candidates.pop();
                delete candidateExists[_candidate];
                emit CandidateRemoved(_candidate);
                return;
            }
        }
    }

    function resetVotes() public onlyAdmin {
        for (uint i = 0; i < candidates.length; i++) {
            votes[candidates[i]] = 0;
        }
        for (uint i = 0; i < registeredVoters.length; i++) {
            hasVoted[registeredVoters[i]] = false;
        }
        totalVotes = 0;
        emit VotesReset();
    }

    // Solidity function should be public and return a list of candidates
    function getCandidates() public view returns (string[] memory) {
        return candidates;
    }

}
