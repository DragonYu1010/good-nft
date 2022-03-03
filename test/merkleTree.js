const {MerkleTree} = require("merkletreejs")
const keccak256 = require("keccak256")
const { soliditySha3 } = require("web3-utils");
require('chai')
    .use(require('chai-as-promised'))
    .should()
const {assert} = require('chai')
const MerkleCont = artifacts.require('./MerkleCont.sol')
const NFT = artifacts.require('./GoodNft.sol')

contract('merkle contract', (accounts) => {
    let nftCont
    let merkleCont, whitelist, res, tree, leafNodes
    let lvl_1, lvl_2, lvl_3
    before(async() => {
        lvl_1 = 1
        lvl_2 = 2
        lvl_3 = 3

        nftCont = await NFT.deployed()
        merkleCont = await MerkleCont.deployed()
        whitelist = [
            {"addr": accounts[0], "level": lvl_1},
            {"addr": accounts[1], "level": lvl_1},
            {"addr": accounts[2], "level": lvl_2},
            {"addr": accounts[3], "level": lvl_2},
            {"addr": accounts[4], "level": lvl_3},
            {"addr": accounts[5], "level": lvl_3},
        ]
        // leafNodes = whitelist.map(addr => keccak256(addr))
        leafNodes = whitelist.map(item => soliditySha3(item.addr, item.level))
        tree = new MerkleTree(leafNodes, keccak256, {sortPairs: true})
    })

    it('set root', async() => {
        const root = tree.getRoot()
        await merkleCont.setRoot(root)
        await nftCont.setWhitelistRoot(root)
    })

    it('verify', async() => {
        let proof = tree.getHexProof(soliditySha3(accounts[0], lvl_1))
        res = await merkleCont.verify(proof, lvl_1)
        console.log(res.logs[0].args)

        proof = tree.getHexProof(soliditySha3(accounts[0], lvl_1))
        res = await merkleCont.verify(proof, lvl_2)
        console.log(res.logs[0].args)

        proof = tree.getHexProof(soliditySha3(accounts[0], lvl_2))
        res = await merkleCont.verify(proof, lvl_2)
        console.log(res.logs[0].args)

        proof = tree.getHexProof(soliditySha3(accounts[1], lvl_1))
        res = await merkleCont.verify(proof, lvl_1, {from: accounts[1]})
        console.log(res.logs[0].args)

        proof = tree.getHexProof(soliditySha3(accounts[1], lvl_1))
        res = await merkleCont.verify(proof, lvl_1, {from: accounts[0]})
        console.log(res.logs[0].args)

        proof = tree.getHexProof(soliditySha3(accounts[1], lvl_2))
        res = await merkleCont.verify(proof, lvl_2, {from: accounts[1]})
        console.log(res.logs[0].args)
    })

    it('nft whitelist mint', async() => {
        await nftCont.setMintStage(3)

        let proof = tree.getHexProof(soliditySha3(accounts[0], lvl_1))
        await nftCont.whitelistMint(1, proof, lvl_1, {value: web3.utils.toWei('0.042', 'ether')})
    })
})