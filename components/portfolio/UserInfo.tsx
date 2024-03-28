import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { View, Text } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getUserAvatar, getUserHandle, getUserName } from "~/utils/privy";

export default function UserInfo() {
  const { ready, authenticated, user, logout } = usePrivy();

  const userAvatar = user ? getUserAvatar(user) : "";
  const userName = user ? getUserName(user) : "";
  const userHandle = user ? getUserHandle(user) : "";

  console.log("privy user info", user);

  if (!ready || !user || !authenticated) {
    return <Text>Loading...</Text>;
  }
  return (
    <View className="flex-row w-full items-center gap-2 ">
      <Avatar alt={userHandle}>
        <AvatarImage source={{ uri: userAvatar }} />
        <AvatarFallback>
          <Text>{userName}</Text>
        </AvatarFallback>
      </Avatar>
      <View>
        <View className="flex-row w-full gap-2">
          <Text>{userName}</Text>
          <Text>@{userHandle}</Text>
        </View>
        <View className="flex-row w-full gap-2">
          <Text>{'11k'} Following</Text>
          <Text>{'11k'} Followers</Text>
        </View>
        <View className="flex-row w-full gap-2">
          <Text>{'11k'} Followers</Text>
        </View>
      </View>
    </View>
  );
}

// return (
//   <>
//     <main className="bg-privy-light-blue flex min-h-screen flex-col px-4 py-6 sm:px-20 sm:py-10">
//       {ready && authenticated ? (
//         <>
//           <div className="flex flex-row justify-between">
//             <h1 className="text-2xl font-semibold">User Info</h1>
//             <button
//               onClick={logout}
//               className="rounded-md bg-violet-200 px-4 py-2 text-sm text-violet-700 hover:text-violet-900"
//             >
//               Logout
//             </button>
//           </div>
//           <div className="mt-12 flex flex-wrap gap-4">
//             {googleSubject ? (
//               <button
//                 onClick={() => {
//                   unlinkGoogle(googleSubject);
//                 }}
//                 className="rounded-md border border-violet-600 px-4 py-2 text-sm text-violet-600 hover:border-violet-700 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
//                 disabled={!canRemoveAccount}
//               >
//                 Unlink Google
//               </button>
//             ) : (
//               <button
//                 onClick={() => {
//                   linkGoogle();
//                 }}
//                 className="rounded-md bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
//               >
//                 Link Google
//               </button>
//             )}

//             {twitterSubject ? (
//               <button
//                 onClick={() => {
//                   unlinkTwitter(twitterSubject);
//                 }}
//                 className="rounded-md border border-violet-600 px-4 py-2 text-sm text-violet-600 hover:border-violet-700 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
//                 disabled={!canRemoveAccount}
//               >
//                 Unlink Twitter
//               </button>
//             ) : (
//               <button
//                 className="rounded-md bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
//                 onClick={() => {
//                   linkTwitter();
//                 }}
//               >
//                 Link Twitter
//               </button>
//             )}

//             {discordSubject ? (
//               <button
//                 onClick={() => {
//                   unlinkDiscord(discordSubject);
//                 }}
//                 className="rounded-md border border-violet-600 px-4 py-2 text-sm text-violet-600 hover:border-violet-700 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
//                 disabled={!canRemoveAccount}
//               >
//                 Unlink Discord
//               </button>
//             ) : (
//               <button
//                 className="rounded-md bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
//                 onClick={() => {
//                   linkDiscord();
//                 }}
//               >
//                 Link Discord
//               </button>
//             )}

//             {email ? (
//               <button
//                 onClick={() => {
//                   unlinkEmail(email.address);
//                 }}
//                 className="rounded-md border border-violet-600 px-4 py-2 text-sm text-violet-600 hover:border-violet-700 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
//                 disabled={!canRemoveAccount}
//               >
//                 Unlink email
//               </button>
//             ) : (
//               <button
//                 onClick={linkEmail}
//                 className="rounded-md bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
//               >
//                 Connect email
//               </button>
//             )}
//             {wallet ? (
//               <button
//                 onClick={() => {
//                   unlinkWallet(wallet.address);
//                 }}
//                 className="rounded-md border border-violet-600 px-4 py-2 text-sm text-violet-600 hover:border-violet-700 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
//                 disabled={!canRemoveAccount}
//               >
//                 Unlink wallet
//               </button>
//             ) : (
//               <button
//                 onClick={linkWallet}
//                 className="rounded-md border-none bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
//               >
//                 Connect wallet
//               </button>
//             )}
//             {phone ? (
//               <button
//                 onClick={() => {
//                   unlinkPhone(phone.number);
//                 }}
//                 className="rounded-md border border-violet-600 px-4 py-2 text-sm text-violet-600 hover:border-violet-700 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
//                 disabled={!canRemoveAccount}
//               >
//                 Unlink phone
//               </button>
//             ) : (
//               <button
//                 onClick={linkPhone}
//                 className="rounded-md border-none bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
//               >
//                 Connect phone
//               </button>
//             )}
//           </div>

//           <p className="mt-6 text-sm font-bold uppercase text-gray-600">
//             User object
//           </p>
//           <textarea
//             value={JSON.stringify(user, null, 2)}
//             className="mt-2 max-w-4xl rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50 sm:text-sm"
//             rows={20}
//             disabled
//           />
//         </>
//       ) : null}
//     </main>
//   </>
// );
