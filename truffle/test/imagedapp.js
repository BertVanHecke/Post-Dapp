const ImageDapp = artifacts.require("ImageDapp");

contract("ImageDapp", ([deployer, author, liker]) => {
  let imageDapp;

  before(async () => {
    imageDapp = await ImageDapp.deployed();
  });

  describe("Deployment", () => {
    
    it("Deploys successfully", async () => {
      const address = await imageDapp.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("Has a name", async () => {
      const name = await imageDapp.name();
      assert.equal(name, "ImageDapp");
    });
  });
});
