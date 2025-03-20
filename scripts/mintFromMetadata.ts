import { ethers } from "hardhat";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    // Get the Contract Factory
    const NFT = await ethers.getContractFactory("InfiniHack");

    // Get the contract address from env var
    const contractAddress = process.env.NFT_CONTRACT_ADDRESS;

    if (!contractAddress) {
        console.error("Please provide the NFT contract address with NFT_CONTRACT_ADDRESS env var");
        process.exit(1);
    }

    const nft = NFT.attach(contractAddress);

    // Read the metadata URIs from the file
    const metadataFile = path.join(__dirname, '../output/metadata_uris.json');

    if (!fs.existsSync(metadataFile)) {
        console.error("Metadata file not found. Please run createMetadataOnly.ts first.");
        process.exit(1);
    }

    const metadataResults = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));

    // Process each recipient
    for (const item of metadataResults) {
        console.log(`\nMinting NFT for ${item.name}...`);
        console.log(`Token ID: ${item.tokenId}`);
        console.log(`Recipient address: ${item.address}`);
        console.log(`Metadata URI: ${item.metadataUri}`);

        // Mint the token with the metadata URI
        const tx = await nft.mint(item.address, item.tokenId, item.metadataUri);

        // Wait for the transaction to be mined
        await tx.wait();

        console.log(`NFT minted successfully! Transaction hash: ${tx.hash}`);
    }

    console.log("\nAll NFTs minted successfully!");
}

// Execute the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
