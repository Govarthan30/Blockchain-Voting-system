# 🗳️ Blockchain Voting System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-lightgrey.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-Testing-orange.svg)](https://hardhat.org/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Contributors](https://img.shields.io/github/contributors/your-username/blockchain-voting)]()

A **decentralized** and **transparent voting system** built on the **Ethereum blockchain** using **Solidity** and **Hardhat**.

---

## 🚀 Installation & Setup

### 🔧 Install Dependencies
```sh
npm install
```

### 🎯 Usage

#### 1️⃣ Start Local Blockchain (Hardhat Node)
```sh
npx hardhat node
```

#### 2️⃣ Deploy Smart Contract
```sh
npx hardhat run scripts/deploy.js --network localhost
```

#### 3️⃣ Open Hardhat Console
```sh
npx hardhat console --network localhost
```

#### 4️⃣ Interact with the Contract

##### 🔹 Get Candidates
```js
const Voting = await ethers.getContractAt("BlockchainVoting", "YOUR_DEPLOYED_CONTRACT_ADDRESS");
const candidates = await Voting.getCandidates();
console.log(candidates);
```

##### 🔹 Register as a Voter
```js
await Voting.connect(ethers.provider.getSigner()).registerVoter();
```

##### 🔹 Vote for a Candidate
```js
await Voting.connect(ethers.provider.getSigner()).vote("Alice");
```

##### 🔹 Check Votes
```js
const votes = await Voting.getVotes("Alice");
console.log("Alice has votes:", votes.toString());
```

##### 🔹 Reset Votes (Admin Only)
```js
await Voting.resetVotes();
```

---

## 📜 Smart Contract (BlockchainVoting.sol)
Located in the `contracts/` folder.

```solidity
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

    function getCandidates() public view returns (string[] memory) {
        return candidates;
    }
}
```

---

## 🧪 Testing
The project includes automated tests using **Mocha & Chai**.

### 📂 Test Structure
Located in the `test/` folder.

### Run tests:
```sh
npx hardhat test
```

### Sample Test (`test/Voting.test.js`)
```js
const { expect } = require("chai");

describe("BlockchainVoting", function () {
    let Voting, voting, owner, addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        const VotingFactory = await ethers.getContractFactory("BlockchainVoting");
        voting = await VotingFactory.deploy(["Alice", "Bob"]);
    });

    it("Should register a voter", async function () {
        await voting.connect(addr1).registerVoter();
        expect(await voting.isRegistered(addr1.address)).to.equal(true);
    });

    it("Should allow a registered voter to vote", async function () {
        await voting.connect(addr1).registerVoter();
        await voting.connect(addr1).vote("Alice");
        expect(await voting.getVotes("Alice")).to.equal(1);
    });
});
```

---

## 📌 Folder Structure
```
blockchain-voting/
│── contracts/           # Solidity smart contract
│   ├── BlockchainVoting.sol
│── scripts/             # Deployment & interaction scripts
│   ├── deploy.js
│   ├── interact.js
│── test/                # Mocha/Chai tests
│   ├── Voting.test.js
│── README.md            # Project documentation
│── hardhat.config.js     # Hardhat configuration
│── package.json         # Dependencies
```

---

## 👥 Contributing
1. **Fork** the repository.
2. **Clone** the project:
   ```sh
   git clone https://github.com/your-username/blockchain-voting.git
   ```
3. **Create a feature branch:**
   ```sh
   git checkout -b feature-name
   ```
4. **Make changes and commit:**
   ```sh
   git commit -m "Added new feature"
   ```
5. **Push to GitHub and create a pull request.**

---

## 🛠 Technologies Used
- Solidity (^0.8.0)
- Hardhat
- Ethers.js
- Node.js
- Mocha & Chai (for testing)

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 📞 Contact
📧 Email: 231401030@rajalakshmi.edu.in  
🔗 GitHub: [your-username](https://github.com/Govarthan30)

---

### ✅ **Next Steps**
- **Replace placeholders** (`YOUR_DEPLOYED_CONTRACT_ADDRESS`, `your-username`, `your-email@example.com`).
- **Add deployment script (`scripts/deploy.js`)** if needed.
- **Include GIFs or diagrams** to improve user experience.

