import { create } from "ipfs-http-client";

const projectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const projectSecret = process.env.REACT_APP_INFURA_SECRET_KEY;

const authorization = `Basic ${Buffer.from(
  `${projectId}:${projectSecret}`
).toString("base64")}`;

/*
  Verbinding maken met IPFS
*/
export let ipfs;
try {
  ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization,
    },
  });
} catch (error) {
  console.error("IPFS error ", error);
  ipfs = undefined;
}
