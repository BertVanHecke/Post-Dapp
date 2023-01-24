const PostDapp = artifacts.require("PostDapp");

module.exports = function (deployer) {
  deployer.deploy(PostDapp);
};
