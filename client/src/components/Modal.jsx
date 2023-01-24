import React, { useState, useContext } from "react";
import { EthContext } from "../contexts/EthContext";
import { ipfs } from "../ipfs/ipfs";

function Modal({ open, setOpen }) {
  const eth = useContext(EthContext);
  const [description, setDescription] = useState(""); // De beschrijving van een post.
  const [amountPerLike, setAmountPerLike] = useState(0); // De hoeveelheid Ether die de auteur vraagt per like.
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const file = form[0].files[0];

    /* 
      We kijken na of er een file geselecteerd is.
    */
    if (!file || file?.length === 0) {
      setLoading(false);
      return alert("No files attached.");
    }

    /* 
      We uploaden de afbeelding naar IPFS en maken een post aan.
    */
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

    /* 
      We resetten de velden van de form.
    */
    setDescription("");
    setAmountPerLike(0);
    form.reset();
  };

  return open ? (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-40"
        onClick={() => setOpen(false)}
      ></div>
      <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
          <div className="mt-3">
            <div className="max-w-screen-xl mx-auto px-8 py-8 text-gray-600 md:px-8">
              <div className="max-w-lg mx-auto space-y-3 sm:text-center">
                <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                  Upload your first photo!
                </p>
                <p>To do so, please fill in the form below.</p>
              </div>
              <div className="mt-12 max-w-lg mx-auto">
                {loading ? (
                  <p className="text-center">Loading...</p>
                ) : (
                  <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
                    <div className="gap-x-6 [&>*]:w-full sm:flex-row">
                      <div>
                        <label className="font-medium">Your photo</label>
                        <input
                          type="file"
                          required
                          className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-600 shadow-sm rounded-lg"
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
                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-600 shadow-sm rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-medium">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full mt-2 h-36 px-3 py-2 resize-none appearance-none bg-transparent outline-none border focus:border-red-600 shadow-sm rounded-lg"
                      ></textarea>
                    </div>
                    <button className="w-full px-4 py-2 text-white font-medium bg-red-600 hover:bg-red-500 active:bg-red-600 rounded-lg duration-150">
                      Post
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default Modal;
