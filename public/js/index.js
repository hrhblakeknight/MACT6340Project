"use strict";

document.addEventListener("DOMContentLoaded", () => {
  let userAddress = null;
  let connect = document.querySelector("#wallet-connect");
  let isPending = false; // State to track if a request is pending

  // Check if MetaMask is already connected
  if (typeof window.ethereum !== 'undefined' && window.ethereum.selectedAddress) {
    userAddress = window.ethereum.selectedAddress;
    let walletString = userAddress.substring(0, 5) + "..." + userAddress.substring(38, 42);
    connect.innerHTML = walletString;
  }

  // Event listener for the button
  connect.addEventListener("click", async () => {
    if (!isPending && !window.ethereum.isConnected()) {
      connectWallet();
    }
  });

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      isPending = true; // Set the state to pending
      connect.disabled = true; // Disable the button
      connect.innerHTML = "Connecting..."; // Show loading text

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
        connect.innerHTML = "Connect Wallet"; // Reset button text
      } finally {
        isPending = false; // Clear the pending state
        connect.disabled = false; // Re-enable the button
      }
    } else {
      console.log("MetaMask is not installed.");
      isPending = false; // Clear the pending state
      connect.disabled = false; // Re-enable the button
      connect.innerHTML = "Connect Wallet"; // Reset button text
    }
  }
});
