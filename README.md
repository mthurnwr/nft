# NFT Project

## Setup

1. Create a `.env` file in the root directory of the project according to the `.env.example` file.
2. Edit the contents in config/content.json. Refer to config/content.example.json.
3. Edit config/recipients.json. Refer to config/recipients.example.json.
4. Add the document to ./document

## Deploying

```bash
npx hardhat ignition deploy ./ignition/modules/InfiniHack.ts
```

## Verifying the contract

```bash
npx hardhat ignition verify chain-<CHAIN_ID>
```

## Prepare metadata for minting

```bash
npx hardhat run scripts/createMetadataForMint.ts --network <NETWORK_NAME>
```

## Minting with the prepared metadata

```bash
NFT_CONTRACT_ADDRESS=<NFT_CONTRACT_ADDRESS> npx hardhat run scripts/mintFromMetadata.ts --network <NETWORK_NAME>
```
