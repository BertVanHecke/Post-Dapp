import React, { useState, useContext } from "react";
import { EthContext } from "../contexts/EthContext";
import { ipfs } from "../ipfs/ipfs";

function PostForm() {
  const eth = useContext(EthContext);
  const [description, setDescription] = useState("");
  const [amountPerLike, setAmountPerLike] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const file = form[0].files[0];

    if (!file || file?.length === 0) {
      setLoading(false);
      return alert("No files attached.");
    }

    try {
      const result = await ipfs.add(file);
      eth.state.contract.methods
        .createPost(result.path, description, amountPerLike)
        .send({ from: eth.state.accounts[0] })
        .on("transactionHash", (hash) => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }

    form.reset();
  };

  return (
    <main className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
        <div className="max-w-lg mx-auto space-y-3 sm:text-center">
          <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
            Upload your first photo!
          </p>
          <p>To do so, please fill in the form below.</p>
        </div>
        <div className="mt-12 max-w-lg mx-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
              <div className="gap-x-6 [&>*]:w-full sm:flex-row">
                <div>
                  <label className="font-medium">Your photo</label>
                  <input
                    type="file"
                    required
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-medium">Price per like</label>
                <input
                  value={amountPerLike}
                  onChange={(e) => setAmountPerLike(e.target.value)}
                  type="number"
                  min="0"
                  required
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full mt-2 h-36 px-3 py-2 resize-none appearance-none bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                ></textarea>
              </div>
              <button className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
                Post
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default PostForm;
