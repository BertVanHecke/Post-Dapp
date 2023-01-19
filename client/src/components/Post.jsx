import React from 'react'

function Post({description, amountPerLike, hash}) {
  return (
    <div>
        <p>{description}</p>
        <p>{amountPerLike}</p>
        <img 
            src={`https://post-dapp.infura-ipfs.io/ipfs/${hash}`}
            width="100px"
            height="100px"
        />
    </div>
  )
}

export default Post