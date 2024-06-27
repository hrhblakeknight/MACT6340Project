"use strict";

document.addEventListener("DOMContentLoaded", () => {
  let userAddress = null;
  let connect = document.querySelector("#wallet-connect");
  let isPending = false;

  // if (window.ethereum) {
  //   connectWallet();
  // } else {
  //   userAddress = null;
  //   connect.innerHTML = "Connect Wallet";
  // }

  if (typeof window.ethereum !== 'undefined' && window.ethereum.selectedAddress) {
    userAddress = window.ethereum.selectedAddress;
    let walletString = userAddress.substring(0, 5) + "..." + userAddress.substring(38, 42);
    connect.innerHTML = walletString;
  }

  connect.addEventListener("click", async () => {
    if (!isPending && typeof window.ethereum !== 'undefined') {
      connectWallet();
    }
  });

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      isPending = true;
      connect.disabled = true;
      connect.innerHTML = "Connecting...";

      try {
        const data = await window.ethereum.request({ method: "eth_requestAccounts" });
        userAddress = data[0];
        let walletString = userAddress.substring(0, 5) + "..." + userAddress.substring(38, 42);
        connect.innerHTML = walletString;
      } catch (err) {
        if (err.code === -32002) {
          console.log("A request is already pending. Please wait.");
        } else if (err.code === 4001) {
          console.log("Please connect a wallet.");
        } else {
          console.error(err);
        }
        connect.innerHTML = "Connect Wallet";
      } finally {
        isPending = false;
        connect.disabled = false;
      }
    } else {
      console.log("MetaMask is not installed.");
      isPending = false;
      connect.disabled = false;
      connect.innerHTML = "Connect Wallet";
    }
  }
});
