// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ImageDapp {
    string public name = "ImageDapp";

    //Id voor post
    uint256 public postCount = 0;

    //List of posts
    mapping(uint256 => Post) public posts;

    //Post object (struct)
    struct Post {
        uint256 id;
        string hash; //De hash die we terugkrijgen van IPFS wanneer de foto opgeslagen is
        string description;
        uint256 likes;
        uint256 amountPerLike; //Hoeveelheid wei er betaald wordt per like
        address payable author;
    }

    //Event dat ons laat weten wanneer er een nieuwe post is aangemaakt
    event PostCreated(
        uint256 id,
        string hash,
        string description,
        uint256 likes,
        uint256 amountPerLike,
        address payable author
    );

    //Event dat ons laat weten wanneer er een post is geliked
    event PostLiked(
        uint256 id,
        string hash,
        string description,
        uint256 likes,
        uint256 amountPerLike,
        address payable author
    );

    //Een post aanmaken
    function createPost(
        string memory _imgHash,
        string memory _description,
        uint256 _amountPerLike
    ) public {
        //Nakijken of de opgeven data correct is
        require(bytes(_description).length > 0); // _description mag niet leeg zijn
        require(bytes(_imgHash).length > 0); // _imghash mag niet leeg zijn
        require(msg.sender != address(0x0)); // het address van de aanmaker moet bestaan

        //Verhoog de post id met 1
        postCount++;

        //Aanmaken van een post en het opslaan in de mapping posts
        posts[postCount] = Post(
            postCount,
            _imgHash,
            _description,
            0,
            _amountPerLike,
            payable(msg.sender)
        );

        //In gang zetten van event om te laten weten dat er een post is aangemaakt
        emit PostCreated(
            postCount,
            _imgHash,
            _description,
            0,
            _amountPerLike,
            payable(msg.sender)
        );
    }

    //Een post liken
    function likePost(uint256 _id) public payable {
        //Nakijken op de opgegeven id correct is
        require(_id > 0 && _id <= postCount);

        //De post opvragen
        Post memory _post = posts[_id];

        //De maker van de post opvragen
        address payable _author = _post.author;

        //De maker van de post betalen
        payable(address(_author)).transfer(msg.value);

        //Aantal likes verhogen
        _post.likes++;

        //Post terug in de mapping steken
        posts[_id] = _post;

        //In gang zetten van event om te laten weten dat er een post is geliked
        emit PostLiked(
            _id,
            _post.hash,
            _post.description,
            _post.likes,
            _post.amountPerLike,
            _author
        );
    }
}
