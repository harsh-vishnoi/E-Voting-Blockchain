const Vote_Contract = artifacts.require("Vote_Contract");

module.exports = function(deployer) {
     deployer.deploy(Vote_Contract);
};
