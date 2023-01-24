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

  /*
    Al de testen die te maken hebben met posts.
  */
  describe("Posts", () => {
    /* 
      Het veld result is voor het antwoord dat wordt teruggestuurd wanneer we een post aanmaken.
      Het veld postCount is voor het opslaan van de postCount.
      Het veld hash is een test hash omdat we hier geen afbeelding opslaan op IPFS en dus geen hash terugkrijgen.
    */
    let result, postCount;
    const hash = "hash";

    /* 
      Voor dat we aan de test beginnen maken we we een post aan, 
      het event dat we aanroepen op het einde van deze functie stuurt een antwoord terug.
    */
    before(async () => {
      result = await postDapp.createPost(hash, "Post description", 1, {
        from: author,
      });
      postCount = await postDapp.postCount();
    });

    /* 
      Test voor het creëren van een post.
    */
    it("Creates a post", async () => {
      /* 
        In de smart contract maken we gebruik van een event wanneer we een post aanmaken.
        We vragen eerst de gegevens van de gelanceerde event op en slaan dit op in een het veld event.
      */
      const event = result.logs[0].args;

      /* 
        We testen eerst of een post succesvol kan worden aangemaakt.
      */
      assert.equal(postCount, 1); // Is het veld postCount gelijk aan 1?
      assert.equal(event.id.toNumber(), postCount.toNumber(), "id is correct"); // Is de id van het event gelijk aan het veld postCount?
      assert.equal(event.hash, hash, "Hash is correct"); // Is de hash van het event gelijk aan de hash van de post?
      assert.equal(
        event.description,
        "Post description",
        "Description is correct"
      ); // Is de beschrijving van het event gelijk aan de beschrijving van de post?
      assert.equal(event.likes.toNumber(), 0, "Likes is correct");
      assert.equal(
        event.amountPerLike.toNumber(),
        1,
        "Amount per like is correct"
      ); // Is de hoeveelheid Ether per like van het event gelijk aan de hoeveelheid Ether per like van de post?
      assert.equal(event.author, author, "Author is the same"); // Is de auteur van het event gelijk aan de auteur van de post?

      /* 
        Vervolgens testen we of een post faalt wanneer de opgegeven parameters niet bruikbaar zijn.
      */
      await postDapp.createPost("", "Post description", 1, {
        from: author,
      }).should.be.rejected; // De hash is leeg en dit zou dus moeten falen.

      await postDapp.createPost(hash, "", 1, {
        from: author,
      }).should.be.rejected; // De beschrijving is leeg en dit zou dus moeten falen.

      await postDapp.createPost(hash, "Post description", -1, {
        from: author,
      }).should.be.rejected; // De hoeveelheid Ether per like is negatief en dit zou dus moeten falen.
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
      }).should.be.rejected;
    });
  });
});
