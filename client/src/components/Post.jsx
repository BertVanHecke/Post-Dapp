import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { EthContext } from "../contexts/EthContext";

function Post({ id, description, amountPerLike, likes, author, hash }) {
  const eth = useContext(EthContext);
  const [loading, setLoading] = useState(false);
  console.log(eth);

  useEffect(() => {
    eth.state.loading ? setLoading(true) : setLoading(false);
  }, [eth]);

  console.log(id)

  const payAuthor = (_id) => {
    setLoading(true);
    const BNamountPerLike = eth.state.web3.utils.BN(amountPerLike);
    const value = eth.state.web3.utils.toWei(BNamountPerLike, "Ether");
    console.log(value);
    eth.state.contract.methods
      .likePost(_id)
      .send({ from: eth.state.accounts[0], value })
      .on("transactionHash", (hash) => {
        setLoading(false);
      });
  };

  return (
    <li className="w-1/2">
      <img
        src={`https://post-dapp.infura-ipfs.io/ipfs/${hash}`}
        className="w-full"
      />
      <button
        className="w-full px-4 py-2 my-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
        onClick={(e) => payAuthor(e.target.name)}
        name={id}
        disabled={loading}
      >
        {amountPerLike} Ether
      </button>
      <p className="text-3xl sm:text-xl">{description}</p>
      <p className="text-3xl sm:text-xl">{likes}</p>
      <p className="text-3xl sm:text-xl">{author}</p>
    </li>
  );
}

export default Post;
