// SPDX-License-Identifier: MIT
/*
    Versies van Solidity die ondersteund zijn, in ons geval is dit vanaf versie 0.4.22 tot 0.9.0 .
*/
pragma solidity >=0.4.22 <0.9.0;

contract PostDapp {
    /* 
        De naam van het slimme contract
    */
    string public name = "PostDapp";

    /* 
        postCount houdt de hoeveelheid posts bij die er geplaatst zijn via het slimme contract.
        Aangezien we de postCount verhogen telkens als er een post wordt aangemaakt, kunnen we dit 
        veld ook gebruiken als unieke id (identifier) voor de posts.
    */
    uint256 public postCount = 0;

    /* 
        Een mapping is een manier om data op te slaan in de vorm van 'key-value' paren. 
        Als key gaan we gebruik maken van het postCount veld. Als value gebruiken we een post object.
    */
    mapping(uint256 => Post) public posts;

    /* 
        Een struct in Solidity komt overen met een object in andere programmeertalen zoals Java of C#.
    */
    struct Post {
        uint256 id; // De unieke identifier van een post.
        string hash; // De hash die we terugkrijgen van IPFS wanneer de foto opgeslagen is.
        string description; // Een beschrijving van de post.
        uint256 likes; // Het aantal likes dat de post heeft.
        uint256 amountPerLike; // Hoeveelheid Ether die er betaald wordt per like.
        address payable author; // De auteur van de post.
    }

    /* 
        Een event in Solidity wordt gebruikt om de applicatie die het contract gebruikt te laten weten wat de 
        huidige situatie van het contract is en wat er eventueel veranderd is. 
        
        Dit event laat de applicatie weten wanneer er een nieuwe post is aangemaakt en welke velden de nieuwe post bevat.
    */
    event PostCreated(
        uint256 id,
        string hash,
        string description,
        uint256 likes,
        uint256 amountPerLike,
        address payable author
    );

    /*
        Dit event laat ons weten wanneer er een post is geliket is en welke velden deze gelikete post bevat.   
    */
    event PostLiked(
        uint256 id,
        string hash,
        string description,
        uint256 likes,
        uint256 amountPerLike,
        address payable author
    );

    /*
        Een functie in Solidity volgt hetzelfde principe als dat van andere programmeertalen, het is een set van 
        instructies die successievelijk uitgevoerd worden.

        Deze functie wordt gebruikt voor het aanmaken van een post.
 
        Memory (geheugen) in Solidity is een tijdelijke plaats om gegevens op te slaan, terwijl Storage (opslag) gegevens tussen functieaanroepen bewaart. 
        Het Solidity Smart Contract kan elke hoeveelheid geheugen gebruiken tijdens de uitvoering, 
        maar zodra de uitvoering stopt, is het geheugen volledig gewist voor de volgende uitvoering.   
        Opslag daarentegen is persistent. Dit wil zeggen dat elke uitvoering van het Smart-contract toegang heeft tot de gegevens die eerder in het opslaggebied waren opgeslagen.

     */
    function createPost(
        string memory _imgHash, // De hash die we terugkrijgen van IPFS wanneer de foto opgeslagen is.
        string memory _description, // Een beschrijving van de post.
        uint256 _amountPerLike // Hoeveelheid Ether die betaald wordt per like.
    ) public {
        /* 
            Nakijken of de parameters _imgHash en _description bruikbaar zijn. 
            We kijken ook na of het adres van de auteur bestaat.
        */
        require(bytes(_description).length > 0); // _description mag niet leeg zijn
        require(bytes(_imgHash).length > 0); // _imghash mag niet leeg zijn
        require(msg.sender != address(0x0)); // het adres van de auteur moet bestaan

        // We verhogen de waarde van het postCount veld met 1
        postCount++;

        /*
            We maken een post aan. We doen dit door gebruik te maken van de posts mapping en de Post struct.

            Voorbeeld als postCount op 1 staat: posts[1] = Post(1, 'hash123...', 'Dit is een post beschrijving!', 0, 2, 0x0...);
        */
        posts[postCount] = Post(
            postCount,
            _imgHash,
            _description,
            0,
            _amountPerLike,
            payable(msg.sender)
        );

        /*
            We 'lanceren' het event om de applicatie te laten weten dat er een post is aangemaakt
        */
        emit PostCreated(
            postCount,
            _imgHash,
            _description,
            0,
            _amountPerLike,
            payable(msg.sender)
        );
    }

    /*
        Deze functie wordt gebruikt voor het liken van een post.
        Wanneer er een post geliket wordt, geven we de id van de gelikete post mee aan deze functie.
    */
    function likePost(uint256 _id) public payable {
        /* 
            Nakijken of de parameter _id bruikbaar is.             
            We kijken na of _id groter is dan 0, dit moet waar zijn aangezien de initiële waarde van postCount (die gebruikt wordt als id) gelijk aan 1 is.
            We kijken ook na of _id kleiner of gelijk is aan postCount, ook dit moet waar zijn aangezien een post 
            met id 20 niet kan bestaan als er maar 15 posts opgeslagen zijn.
        */
        require(_id > 0 && _id <= postCount);

        /*
            We vragen de gegevens van de gelikete post op uit de mapping posts en slaan het op in een Post object met de naam _post.
        */
        Post memory _post = posts[_id];

        /*
            We vragen het adres van de auteur op uit het object _post.

            Payable wilt zeggen dat we verwachten dat dit adres gebruikt gaat worden om transacties mee uit te voeren.
        */
        address payable _author = _post.author;

        /*
            We betalen de auteur van de post aan de hand van het _author veld en de transfer functie die Solidity voor ons voorziet.
        */
        payable(address(_author)).transfer(msg.value);

        /*
            We verhogen de waarde van het aantal likes van de post met 1
        */
        _post.likes++;

        /* 
            We plaatsen de post terug op zijn plaats in de mapping posts.
        */
        posts[_id] = _post;

        /*
            We 'lanceren' het event om de applicatie te laten weten dat er een post is geliket.
        */
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
