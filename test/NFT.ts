import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("NFT", function () {
    async function deployNFTFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const NFT = await hre.ethers.getContractFactory("NFT");
        const nft = await NFT.deploy();

        return { nft, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { nft, owner } = await loadFixture(deployNFTFixture);

            expect(await nft.owner()).to.equal(owner.address);
        });
    });

    describe("Minting", function () {
        it("Should allow owner to mint tokens with URI", async function () {
            const { nft, owner, otherAccount } = await loadFixture(deployNFTFixture);
            const tokenURI = "https://example.com/nft/1";

            await nft.mint(otherAccount.address, 1, tokenURI);
            expect(await nft.ownerOf(1)).to.equal(otherAccount.address);
            expect(await nft.tokenURI(1)).to.equal(tokenURI);
        });

        it("Should not allow non-owners to mint tokens", async function () {
            const { nft, otherAccount } = await loadFixture(deployNFTFixture);
            const tokenURI = "https://example.com/nft/1";

            await expect(
                nft.connect(otherAccount).mint(otherAccount.address, 1, tokenURI)
            ).to.be.reverted;
        });
    });
});