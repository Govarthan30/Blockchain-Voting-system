const { ethers } = require("hardhat");
const axios = require("axios"); // Import axios for database integration

async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update after deployment
    const [admin, voter] = await ethers.getSigners(); // Admin & voter accounts
    const Voting = await ethers.getContractAt("BlockchainVoting", contractAddress);

    console.log("✅ Connected to BlockchainVoting at:", contractAddress);

    try {
        // Fetch candidates
        const candidates = await Voting.getCandidates();
        console.log("🗳️ Candidates:", candidates);
        if (candidates.length === 0) throw new Error("No candidates found!");

        // Register voter
        let isRegistered = await Voting.isRegistered(voter.address);
        if (!isRegistered) {
            console.log("🔹 Registering voter...");
            const tx = await Voting.connect(voter).registerVoter();
            await tx.wait();
            console.log("✅ Voter registered!");
        }

        // Vote for a candidate
        const candidateToVote = candidates.length > 0 ? candidates[0] : null;

        if (!candidateToVote) {
            throw new Error("No candidates available to vote for!");
        }
 // Ensure candidate exists
        console.log(`🗳️ Voting for: ${candidateToVote}`);
        const tx1 = await Voting.connect(voter).vote(candidateToVote);
        await tx1.wait();
        console.log(`✅ Voted for: ${candidateToVote}`);

        // Fetch votes and store in database
        for (const candidate of candidates) {
            const votes = await Voting.getVotes(candidate);
            console.log(`📊 ${candidate} has votes:`, votes.toString());

            // Store vote count in database
            try {
                await axios.post("http://localhost:5000/store-vote", {
                    candidate: candidate,
                    votes: votes.toString(),
                });
                console.log(`✅ Vote count for ${candidate} stored in database!`);
            } catch (error) {
                console.error("❌ Failed to store vote in DB:", error.message);
            }
        }

        // Admin actions
        if (admin.address === (await Voting.admin())) {
            console.log("🔐 Admin Privileges Detected!");

            // Adding a new candidate
            console.log("➕ Adding candidate: David");
            const tx2 = await Voting.addCandidate("David");
            await tx2.wait();
            console.log("✅ Candidate David added!");

            // Reset votes
            console.log("🔄 Resetting votes...");
            const tx3 = await Voting.resetVotes();
            await tx3.wait();
            console.log("✅ Votes reset successfully!");
        } else {
            console.log("⚠️ Only admin can add candidates or reset votes!");
        }
    } catch (error) {
        console.error("❌ Interaction failed:", error.reason || error);
    }
}

main().catch((error) => {
    console.error("❌ Script Error:", error);
    process.exit(1);
});
