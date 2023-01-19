import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { EthContext } from "../contexts/EthContext";
import Post from "./Post";

function Feed() {
  const eth = useContext(EthContext);
  const [posts, setposts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eth.state.loading) {
      return;
    } else {
      getPosts();
    }
  }, [eth]);

  const getPosts = async () => {
    const postCount = await eth.state.contract.methods.postCount().call();

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
        <p>Loading...</p>
      ) : (
        posts.map((post) => {
          return (
            <Post
              key={post.id}
              description={post.description}
              amountPerLike={post.amountPerLike}
              hash={post.hash}
            />
          );
        })
      )}
    </div>
  );
}

export default Feed;
