import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { EthContext } from "../contexts/EthContext";
import Post from "./Post";

/* 
  De feed die te zien is wanneer je de applicatie opstart.
*/
function Feed() {
  const eth = useContext(EthContext); // Context die het mogelijk maakt om de data van het slimme contract te gebruiken in alle components die de context importeren.
  const [posts, setposts] = useState([]); // Een lijst van posts.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eth.state.loading) {
      return;
    } else {
      getPosts();
    }
  }, [eth]);

  /*
    Functie die alle posts ophaalt uit het slimme contract en opslaat in de posts state.
  */
  const getPosts = async () => {
    /*
      We halen de waarde van het postCount veld op om te weten wat het totaal aantal posts is.
    */
    const postCount = await eth.state.contract.methods.postCount().call();

    /*
      We halen elke post op en voegen deze toe aan de posts lijst door de itereren zolang als dat de waarde van index <= aan het aantal posts.
    */
    let postArray = [];
    for (let index = 1; index <= postCount; index++) {
      const post = await eth.state.contract.methods.posts(index).call();
      postArray.push(post);
    }
    setposts(postArray);
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="py-14">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="mt-6">
              <ul className="flex gap-x-10 gap-y-10 flex-wrap items-center justify-center md:gap-x-16">
                {posts.map((post) => {
                  return (
                    <Post
                      key={post.id}
                      id={post.id}
                      likes={post.likes}
                      author={post.author}
                      description={post.description}
                      amountPerLike={post.amountPerLike}
                      hash={post.hash}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feed;
