import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { EthContext } from "../contexts/EthContext";

/*
  Een individuele post
*/
function Post({ id, description, amountPerLike, likes, author, hash }) {
  const eth = useContext(EthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    eth.state.loading ? setLoading(true) : setLoading(false);
  }, [eth]);

  const payAuthor = (_id) => {
    setLoading(true);
    /* 
      We zetten de hoeveelheid Ether die gevraagd wordt door den auteur voor een like om in Wei.
      Wei is een eenheid van Ether: 1 ETH is gelijk aan 1,000,000,000,000,000,000 wei.
    */
    const BNamountPerLike = eth.state.web3.utils.BN(amountPerLike);
    const value = eth.state.web3.utils.toWei(BNamountPerLike, "Ether");
    eth.state.contract.methods
      .likePost(_id)
      .send({ from: eth.state.accounts[0], value })
      .on("transactionHash", (hash) => {
        setLoading(false);
      });
  };

  return (
    <li className="w-1/2 border-b-2 border-grey-300">
      <div className="py-3 mb-3 flex justify-between">
        <p className="text-3xl sm:text-xl font-medium ">Author: {author}</p>
        <p className="text-3xl sm:text-xl font-medium">Likes: {likes}</p>
      </div>
      <img
        src={`https://post-dapp.infura-ipfs.io/ipfs/${hash}`}
        className="w-full"
      />
      <button
        className="w-full px-4 py-2 my-2 text-white font-medium bg-red-600 hover:bg-red-500 active:bg-red-600 rounded-lg duration-150"
        onClick={(e) => payAuthor(e.target.name)}
        name={id}
        disabled={loading}
      >
        {amountPerLike} Ether
      </button>
      <p className="text-3xl sm:text-xl pb-10 pt-5">{description}</p>
    </li>
  );
}

export default Post;
