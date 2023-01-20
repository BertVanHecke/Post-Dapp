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
