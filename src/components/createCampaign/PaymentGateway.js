import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { escrowABI, escrowAddress } from "../escrowContract/constants";
import { Redirect } from "react-router-dom";

// THIS INTEGRATED PAYMENT GATEWAY REQUIRES INFORMATIONS LIKE VENDORS' NAME AND LOCATION BEFORE ALLOWING THE TRANSACTION. THIS MAKES THE TRACKING MUCH MORE SPECIFIC THAN ETHERSCAN APIs WHICH ONLY PROVIDE THE ADDRESSES BETWEEN WHICH TRANSACTION HAS OCCURED.

export default function PaymentGateway() {
  const { ethereum } = window;
  const [amountData, setAmountData] = useState("");
  const [addressData, setAddressData] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [vendor, setVendor] = useState("");
  const [location, setLocation] = useState("");
  const [back, handleBack] = useState(false);
  const [buttonText, setButtonText] = useState("TRANSFER ETH");
  const changeText = (text) => setButtonText(text);
  const date = new Date();
  const stringDate = date.toLocaleDateString();

  const createEscrowContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const escrowContract = new ethers.Contract(
      escrowAddress,
      escrowABI,
      signer
    );
    return escrowContract;
  };

  const escrowContract = createEscrowContract();

  //THESE TWO useEffects STORE THE ENTERED PAYMENT DATA IN LOCAL STORAGE TO RETAIN IT THROUGH RELOADS.
  useEffect(() => {
    setVendor(JSON.parse(window.localStorage.getItem("vendor")));
    setLocation(JSON.parse(window.localStorage.getItem("location")));
    setAmountData(JSON.parse(window.localStorage.getItem("amount")));
    setAddressData(JSON.parse(window.localStorage.getItem("address")));
  }, [currentAccount]);
  useEffect(() => {
    window.localStorage.setItem("vendor", JSON.stringify(vendor));
    window.localStorage.setItem("location", JSON.stringify(location));
    window.localStorage.setItem("amount", JSON.stringify(amountData));
    window.localStorage.setItem("address", JSON.stringify(addressData));
  }, [vendor, location, amountData, addressData, currentAccount]);

  const handleName = (e) => {
    setVendor(e.target.value);
  };
  const handleLocation = (e) => {
    setLocation(e.target.value);
  };

  const handleChange = (e) => {
    setAmountData(e.target.value);
  };
  const handleAddress = (e) => {
    setAddressData(e.target.value);
  };
  ethereum.on("accountsChanged", function () {
    window.location.reload();
  });

  useEffect(() => {
    async function connectWallet() {
      if (typeof ethereum !== "undefined") {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrentAccount(accounts[0]);
      }
    }
    connectWallet();
  }, [currentAccount, setCurrentAccount, ethereum]);

  // USING SMART CONTRACT FUNCTION TO PAY DIRECTLY FORM THE CONTRACT. THE FUNDS NEVER REACH THE CAMPAIGNS' ACCOUNT.

  const sendETH = async (e) => {
    e.preventDefault();
    try {
      if (ethereum) {
        const payHash = await escrowContract.pay(
          currentAccount,
          addressData,
          ethers.utils.parseEther(amountData, "ether")
        );
        changeText("TRANSFERRING...");
        payHash.wait();
        const paymentDetailsHash = await escrowContract.paymentToVendor(
          currentAccount,
          addressData,
          vendor,
          location,
          amountData,
          stringDate
        );
        await paymentDetailsHash.wait(); // ADDING PAYMENT DETAILS TO BLOCKCHAIN : FOR TRACKING.
        changeText("TRANSFERRED");
      } else {
        changeText("TRANSACTION FAILED. INSUFFICIENT BALANCE.");
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      changeText("TRANSACTION FAILED. INSUFFICIENT BALANCE.");
      throw new Error("No ethereum object");
    }
  };
  return (
    <>
      {!back && (
        <div className="single-outer">
          <div className="single-card-item-gateway">
            <button className="one-more button-su" onClick={handleBack}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fillRule="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
            </button>
            <form className="gateway-form" onSubmit={sendETH}>
              <p className="gateway-lable">TRANSFER TO</p>
              <br />
              <input
                id="transfer-to-account"
                className="transfer-to"
                type="text"
                required
                autoComplete="off"
                value={addressData}
                onChange={handleAddress}
              />
              <br />
              <p className="gateway-lable">VENDOR NAME</p>
              <br />
              <input
                id="vendor-name"
                className="vendor-name"
                type="text"
                required
                autoComplete="off"
                value={vendor}
                onChange={handleName}
              />
              <br />
              <p className="gateway-lable">VENDOR LOCATION</p>
              <br />
              <input
                id="vendor-location"
                className="vendor-location"
                type="text"
                required
                autoComplete="off"
                value={location}
                onChange={handleLocation}
              />
              <br />
              <p className="gateway-lable">AMOUNT (ETH)</p>
              <br />
              <input
                id="amount"
                className="amount"
                type="number"
                min={0.000000000000000001}
                step={0.000000000000000001}
                required
                autoComplete="off"
                value={amountData}
                onChange={handleChange}
              />
              <br />
              <button
                className="variable-width-btn button-su transaction-list-btn"
                type="submit"
              >
                {buttonText}
              </button>
            </form>
          </div>
        </div>
      )}
      {back && <Redirect to="/yourCampaign" />}
    </>
  );
}
