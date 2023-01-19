const ImageDapp = artifacts.require("ImageDapp");

require("chai").use(require("chai-as-promised")).should();

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

  describe("Posts", () => {
    let result, postCount;
    const hash = "hash";

    before(async () => {
      result = await imageDapp.createPost(hash, "Post description", {
        from: author,
      });
      postCount = await imageDapp.postCount();
    });

    it("Creates a post", async () => {
      // SUCESS
      assert.equal(postCount, 1);
      const event = result.logs[0].args;

      assert.equal(event.id.toNumber(), postCount.toNumber(), "id is correct");
      assert.equal(event.hash, hash, "Hash is correct");
      assert.equal(
        event.description,
        "Post description",
        "Description is correct"
      );
      assert.equal(event.likes.toNumber(), 0, "Likes is correct");
      assert.equal(
        event.amountPerLike.toNumber(),
        0,
        "Amount per like is correct"
      );
      assert.equal(event.author, author, "Author is the same");

      //FAILURE
      await imageDapp.createPost("", "Post description", {
        from: author,
      }).should.be.rejected;

      await imageDapp.createPost(hash, "", {
        from: author,
      }).should.be.rejected;
    });

    it("Lists posts", async () => {
      const post = await imageDapp.posts(postCount);
      assert.equal(post.id.toNumber(), postCount.toNumber(), "id is correct");
      assert.equal(post.hash, hash, "Hash is correct");
      assert.equal(
        post.description,
        "Post description",
        "Description is correct"
      );
      assert.equal(post.likes.toNumber(), 0, "Likes is correct");
      assert.equal(
        post.amountPerLike.toNumber(),
        0,
        "Amount per like is correct"
      );
      assert.equal(post.author, author, "Author is the same");
    });
  });
});
