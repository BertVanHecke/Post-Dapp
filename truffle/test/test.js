const { assert } = require("chai");

const PostDapp = artifacts.require("PostDapp");

require("chai").use(require("chai-as-promised")).should();

contract("PostDapp", ([deployer, author, liker]) => {
  let postDapp;

  before(async () => {
    postDapp = await PostDapp.deployed();
  });

  describe("Deployment", () => {
    it("Deploys successfully", async () => {
      const address = await postDapp.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("Has a name", async () => {
      const name = await postDapp.name();
      assert.equal(name, "PostDapp");
    });
  });

  describe("Posts", () => {
    let result, postCount;
    const hash = "hash";

    before(async () => {
      result = await postDapp.createPost(hash, "Post description", 1, {
        from: author,
      });
      postCount = await postDapp.postCount();
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
        1,
        "Amount per like is correct"
      );
      assert.equal(event.author, author, "Author is the same");

      //FAILURE
      await postDapp.createPost("", "Post description", 1, {
        from: author,
      }).should.be.rejected;

      await postDapp.createPost(hash, "", 1, {
        from: author,
      }).should.be.rejected;

      await postDapp.createPost(hash, "Post description", -1, {
        from: author,
      }).should.be.rejected;
    });

    it("Lists posts", async () => {
      const post = await postDapp.posts(postCount);
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
        1,
        "Amount per like is correct"
      );
      assert.equal(post.author, author, "Author is the same");
    });

    it("Allows users to like posts", async () => {
      let oldAuthorBalance;
      oldAuthorBalance = await new web3.eth.getBalance(author);
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

      const post = await postDapp.posts(postCount);

      result = await postDapp.likePost(postCount, {
        from: liker,
        value: web3.utils.toWei(post.amountPerLike, "Ether"),
      });

      //SUCCESS
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), post.id.toNumber(), "id is correct");
      assert.equal(event.hash, post.hash, "Hash is correct");
      assert.equal(
        event.description,
        post.description,
        "Description is correct"
      );
      assert.equal(
        event.likes.toNumber(),
        post.likes.toNumber() + 1,
        "Likes is correct"
      );
      assert.equal(
        event.amountPerLike.toNumber(),
        post.amountPerLike.toNumber(),
        "Amount per like is correct"
      );
      assert.equal(event.author, post.author, "Author is the same");

      //Check that the author recieved funds
      let newAuthorBalance;
      newAuthorBalance = await new web3.eth.getBalance(author);
      newAuthorBalance = new web3.utils.BN(newAuthorBalance);

      let tipPostOwner;
      tipPostOwner = web3.utils.toWei(post.amountPerLike, "Ether");
      tipPostOwner = new web3.utils.BN(tipPostOwner);

      const expectedBalance = oldAuthorBalance.add(tipPostOwner);

      assert.equal(
        newAuthorBalance.toString(),
        expectedBalance.toString(),
        "Balance is equal"
      );

      //FAILURE
      await postDapp.likePost(10, {
        from: liker,
        value: web3.utils.toWei(post.amountPerLike, "Ether"),
      }).should.be.rejected
    });
  });
});
