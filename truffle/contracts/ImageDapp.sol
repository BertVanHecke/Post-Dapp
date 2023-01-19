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

    //Een post aanmaken
    function createPost(string memory _imgHash, string memory _description)
        public
    {
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
            0,
            payable(msg.sender)
        );

        //In gang zetten van event om te laten weten dat er een post is aangemaakt
        emit PostCreated(
            postCount,
            _imgHash,
            _description,
            0,
            0,
            payable(msg.sender)
        );
    }

    //Een post liken
}
