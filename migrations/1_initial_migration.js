// const GoodNft = artifacts.require("GoodNft");
// const Mum = artifacts.require("Mum");
// const Star = artifacts.require("Star");

// module.exports = function (deployer) {
// 	deployer.deploy(GoodNft, "ARBO Heros", "ARBO");
// 	deployer.deploy(Mum, "ARBO Heros", "ARBO");
// 	deployer.deploy(Star);
// };


const Mum2 = artifacts.require("Mum2");
const Star = artifacts.require("Star");

module.exports = function (deployer) {
	deployer.deploy(Mum2);
	deployer.deploy(Star);
};


