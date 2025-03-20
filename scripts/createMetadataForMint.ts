import { createAndPinMetadata } from "./createMetadata";
import pinataSDK from '@pinata/sdk';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Load configuration files
const recipients = require('../config/recipients.json');
const contentConfig = require('../config/content.json');

// Initialize Pinata client
const pinata = new pinataSDK(
    process.env.PINATA_API_KEY || '',
    process.env.PINATA_API_SECRET || ''
);

async function uploadPdfToIpfs(pdfPath: string): Promise<string> {
    try {
        const result = await pinata.pinFromFS(pdfPath);
        return result.IpfsHash;
    } catch (error) {
        console.error("Error uploading PDF to IPFS:", error);
        throw error;
    }
}

async function main() {
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Output file for metadata URIs
    const outputFile = path.join(outputDir, 'metadata_uris.json');
    const metadataResults = [];

    // Upload the shared PDF to IPFS (only need to do this once)
    console.log("Uploading PDF to IPFS...");
    const pdfIpfsHash = await uploadPdfToIpfs(contentConfig.pdfPath);
    console.log(`PDF uploaded to IPFS with hash: ${pdfIpfsHash}`);

    // Process each recipient
    for (const recipient of recipients) {
        console.log(`\nProcessing metadata for ${recipient.name}...`);

        // Create and pin metadata for this recipient
        console.log("Creating and pinning metadata...");
        const metadataUri = await createAndPinMetadata(
            recipient.name,
            contentConfig.largeText,
            contentConfig.fileUrl,
            pdfIpfsHash,
            recipient.tokenId
        );
        console.log(`Metadata pinned to IPFS: ${metadataUri}`);

        // Add to results
        metadataResults.push({
            name: recipient.name,
            address: recipient.address,
            tokenId: recipient.tokenId,
            metadataUri: metadataUri,
            viewableLink: metadataUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
        });
    }

    // Write results to file
    fs.writeFileSync(outputFile, JSON.stringify(metadataResults, null, 2));
    console.log(`\nAll metadata URIs have been saved to ${outputFile}`);
    console.log("Please review the metadata before proceeding with minting.");
}

// Execute the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
