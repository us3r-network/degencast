export default function useFarcasterSigner() {
  return {
    hasSigner: false,
    requestSigner: () => {
      console.log("Privy Expo SDK DOES NOT SUPPORT requestSigner");
    },
    requesting: false,
    getPrivySigner: async () => {
      console.log("Privy Expo SDK DOES NOT SUPPORT getPrivySigner");
      return undefined;
    },
  };
}
