import React from "react";
// THIS COMPONENT LOADS WHEN THE APP IS STARTED: DISPLAYS THE CONNECTED ACCOUNT AND WORKS AS A SAFEGUARD; MAKES SURE USER CONNECTS THE WALLET AND HENCE PREVENTS ANY EVENT THAT MAY OCCUR BECAUSE OF THE DISCONNECTED WALLET.
export default function CurrentAccount({ currentAccount }) {
  return (
    <div className="currentAccount">
      {currentAccount && <>Connected Wallet Address: {currentAccount}</>}
    </div>
  );
}
