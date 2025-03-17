import { ethers } from "hardhat";

async function main() {
    // Get the parameters from command line arguments
    const tokenId = process.env.TOKEN_ID ? parseInt(process.env.TOKEN_ID) : 1;
    const tokenURI = process.env.TOKEN_URI || "https://example.com/nft/1";
    const recipientAddress = process.env.RECIPIENT_ADDRESS;

    if (!recipientAddress) {
        console.error("Please provide a recipient address with RECIPIENT_ADDRESS env var");
        process.exit(1);
    }

    // Get the Contract Factory
    const NFT = await ethers.getContractFactory("NFT");

    // For this example, we'll get the contract address from env var
    // In a real-world scenario, you'd get this from your deployment
    const contractAddress = process.env.NFT_CONTRACT_ADDRESS;

    if (!contractAddress) {
        console.error("Please provide the NFT contract address with NFT_CONTRACT_ADDRESS env var");
        process.exit(1);
    }

    const nft = NFT.attach(contractAddress);

    console.log(`Minting NFT #${tokenId} to ${recipientAddress} with URI: ${tokenURI}`);

    // Mint the token
    const tx = await nft.mint(recipientAddress, tokenId, tokenURI);

    // Wait for the transaction to be mined
    await tx.wait();

    console.log(`NFT minted successfully! Transaction hash: ${tx.hash}`);
    console.log(`You can check the NFT at: ${tokenURI}`);
}

// Execute the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
