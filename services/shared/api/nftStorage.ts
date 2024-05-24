// import { NFTStorage } from "nft.storage";
import { NFTStorage } from "nft.storage/dist/bundle.esm.min.js";

// read the API key from an environment variable. You'll need to set this before running the example!
const API_KEY = process.env.EXPO_PUBLIC_NFT_STORAGE_API_KEY;

const META_DATA = {
  name: "Demo Name",
  description: "Demo Deacription",
  image: null,
  properties: {
    type: "blog-post",
    origins: {
      http: "https://blog.nft.storage/posts/2021-11-30-hello-world-nft-storage/",
      ipfs: "ipfs://bafybeieh4gpvatp32iqaacs6xqxqitla4drrkyyzq6dshqqsilkk3fqmti/blog/post/2021-11-30-hello-world-nft-storage/",
    },
    authors: [
      {
        name: "David Choi",
      },
    ],
    content: {
      "text/markdown":
        "The last year has witnessed the explosion of NFTs onto the world’s mainstage. From fine art to collectibles to music and media, NFTs are quickly demonstrating just how quickly grassroots Web3 communities can grow, and perhaps how much closer we are to mass adoption than we may have previously thought. <... remaining content omitted ...>",
    },
  },
};

// For example's sake, we'll fetch an image from an HTTP URL.
// In most cases, you'll want to use files provided by a user instead.
export async function getImage(imageOriginUrl: string) {
  const r = await fetch(imageOriginUrl);
  if (!r.ok) {
    throw new Error(`error fetching image: ${r.status}`);
  }
  return r.blob();
}

export async function storeNFT(nft: any) {
  try {
    if (API_KEY) {
      const client = new NFTStorage({ token: API_KEY });
      const metadata = await client.store(nft);
      return metadata.url as string;
    } else {
      throw new Error("NFT_STORAGE_API_KEY is not set");
    }
  } catch (error) {
    console.error("error storing NFT:", error);
  }
}

export const parseIPFSImage = (ipfs: any) => {
  if (ipfs && ipfs.url && ipfs.url.includes("ipfs://")) {
    const url = new URL(ipfs?.url);
    const cid = url.pathname.replace("//", "");
    return `https://ipfs.io/ipfs/${cid}`;
  }
  return null;
};
