import fs from 'fs';
import path from 'path';
import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Pinata client
const pinata = new pinataSDK(
    process.env.PINATA_API_KEY || '',
    process.env.PINATA_API_SECRET || ''
);

interface NFTMetadata {
    name: string;
    description: string;
    external_url?: string;
    attributes: Array<{
        trait_type: string;
        value: string;
    }>;
    properties: {
        files: Array<{
            uri: string;
            type: string;
            name?: string;
        }>;
        text_content?: string;
    };
}

export async function createAndPinMetadata(
    recipientName: string,
    largeText: string,
    fileUrl: string,
    pdfIpfsHash: string,
    tokenId: number
): Promise<string> {
    // Create metadata object
    const metadata: NFTMetadata = {
        name: `${recipientName}'s NFT #${tokenId}`,
        description: "Infini Hack NFT",
        attributes: [
            {
                trait_type: "Name",
                value: recipientName
            }
        ],
        properties: {
            files: [
                {
                    uri: fileUrl,
                    type: "application/octet-stream",
                    name: "Attached File"
                },
                {
                    uri: `ipfs://${pdfIpfsHash}`,
                    type: "application/pdf",
                    name: "PDF Document"
                }
            ],
            text_content: largeText
        }
    };

    // Save metadata to temp file
    const tempFilePath = path.join(__dirname, `../temp_metadata_${tokenId}.json`);
    fs.writeFileSync(tempFilePath, JSON.stringify(metadata, null, 2));

    try {
        // Pin the metadata to IPFS via Pinata
        const result = await pinata.pinFromFS(tempFilePath);

        // Clean up temp file
        fs.unlinkSync(tempFilePath);

        // Return the IPFS URI for the metadata
        return `ipfs://${result.IpfsHash}`;
    } catch (error) {
        console.error("Error pinning metadata to IPFS:", error);
        throw error;
    }
}
