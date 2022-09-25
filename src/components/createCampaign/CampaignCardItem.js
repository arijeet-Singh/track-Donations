import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./CampaignCard.css";
import TrackTransactions from "../TrackTransactions";

// FOR EACH DETAIL PASSED ONTO THIS COMPONENT BY THE <CampaignList /> COMPONENT, THIS COMPONENT RENDERS IT INTO A CARD WITH ADDED CSS. ALL THE LOGICAL FEATURES, LIKE THE "FUND CAMPAIGN" AND "TRANSACTION TRACKING" ARE WRAPPED IN THIS COMPONENT ITSELF.

const CampaignCardItem = (props) => {
  const { ethereum } = window;
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("TRANSFER ETH");
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setformData] = useState("");
  const [isFund, setIsFund] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [noTransfer, setNoTransfer] = useState(false);
  const [transferDone, setTransferDone] = useState(false);
  const [amountRaised, setAmountRaised] = useState(0);
  const addressTo = props.wallet;
  const changeText = (text) => setButtonText(text);

  useEffect(() => {
    async function getRaisedAmount() {
      const total = await props.escrowContract.getTotalDonation(addressTo);
      setAmountRaised(parseInt(total._hex, 16) / 10000000000 / 100000000);
    }
    getRaisedAmount();
  }, [amountRaised, setAmountRaised, transferDone]); // THIS DISPLAYS THE TOTAL AMOUNT RAISED SO FAR.

  const handleChange = (e) => {
    setformData(e.target.value);
  };

  ethereum.on("accountsChanged", function () {
    window.location.reload(); // WINDOW RELOADS WHEN METAMASK WALLET ACCOUNT CHANGES, TO SET THE CURRENT ACCOUNT AS THE CHOSEN ONE.
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
  }, [currentAccount, setCurrentAccount, ethereum]); // IF NOT CONNECTED ALREADY, THIS FUNCTION PROMPTS US TO CONNECT METAMASK WALLET.

  // FUNDS ARE NOT SENT DIRECTLY TO THE WALLET ADDRESS OF THE CAMPAIGN, INSTEAD THEY ARE HELD IN ESCROW BY THE SMART CONTRACT. THIS MAKES SURE THAT THE CAMPAIGN CANNOT TRANSFER THE DONATED FUNDS TO ANOTHER WALLET DIRECTLY. THE ONLY WAY TO USE THE DONATED FUNDS IS BY USING THE INTEGRATED PAYMENT GATEWAY: WHICH REQUIRES THE CAMPAIGN "MANAGER" TO EXPLICITLY STATE THE NAME AND LOCATION OF THE VENDOR TO WHOM THE PAYMENT WAS MADE.


  const sendETH = async (e) => {   
    e.preventDefault();
    const fundHash = await props.escrowContract.fund(addressTo, {
      value: ethers.utils.parseEther(formData, "ether"),
    });
    changeText("TRANSFERRING...");
    await fundHash.wait();
    setIsLoading(true);
    setIsLoading(false);
    changeText("TRANSFERRED");
    setTransferDone(true);
  };

  function fundCampaignHandler() {
    setIsFund(true);
    if (amountRaised === parseInt(props.target)) { //NO MORE FUNDS CAN BE SENT TO THE CAMPAIGN ONCE THE TARGET IS REACHED.
      setNoTransfer(true);
    }
  }

  async function handleList() { // A USER CAN VIEW THE TRANSACTION HISTORY OF A CAMPAIGN ONLY IF IT IS A DONOR OF THAT CAMPAIGN.
    const enter = await props.escrowContract.checkIfFunder(
      currentAccount,
      addressTo
    );
    setIsAllowed(enter);
    if (!enter) {
      alert("Not a Donor");
    }
  }

  function handleBack() {
    setIsAllowed(false);
  }

  return (
    <>
      {!isAllowed ? (
        <div className="outer">
          <div className="card-item">
            <div className="card-box table">
              <div className="card-info">
                <div className="card-preview">
                  <h2> {props.ngo}</h2>
                  <h4> {props.email}</h4>
                  <h4> {props.phone}</h4>
                  <hr />
                </div>
                <table className="table-content">
                  <tbody>
                    <tr>
                      <td className="table-entry-td">
                        {" "}
                        <span className="data-span">Mission</span>
                      </td>
                      <td className="table-data-td">
                        <u>{props.objective} </u>
                      </td>
                    </tr>
                    <tr>
                      <td className="table-entry-td">
                        {" "}
                        <span className="data-span">Minimum Donation</span>
                      </td>
                      <td className="table-data-td">
                        <u>{props.minimum} ETH </u>
                      </td>
                    </tr>
                    <tr>
                      <td className="table-entry-td">
                        {" "}
                        <span className="data-span">Target Amount</span>
                      </td>
                      <td className="table-data-td">
                        <u>{props.target} ETH </u>
                      </td>
                    </tr>
                    <tr>
                      <td className="table-entry-td">
                        <span className="data-span"> Wallet Address</span>
                      </td>
                      <td className="table-data-td">
                        <u>
                          {props.wallet.slice(0, 10)}
                          {"..."}
                          {props.wallet.slice(16, 32)}
                        </u>
                      </td>
                    </tr>
                    <tr>
                      <td className="table-entry-td">
                        <span className="data-span">Amount Raised</span>
                      </td>
                      <td className="table-data-td">
                        <u>{amountRaised} ETH</u>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {!isFund && (
                  <button
                    className="variable-width-btn button-su fund-campaign-btn"
                    onClick={fundCampaignHandler}
                  >
                    FUND CAMPAIGN
                  </button>
                )}
                {noTransfer && (
                  <>
                    <p className="done">TARGET REACHED. THANK YOU.</p>

                    <button
                      className="variable-width-btn button-su transaction-list-btn"
                      onClick={handleList}
                    >
                      TRANSACTION HISTORY
                    </button>
                  </>
                )}
                {isFund && !noTransfer && (
                  <form onSubmit={sendETH}>
                    {!transferDone && (
                      <input
                        className="fund-campaign-input"
                        name="amount"
                        type="number"
                        placeholder="ETH"
                        min={parseFloat(props.minimum)}
                        step={0.000001}
                        onChange={handleChange}
                      />
                    )}

                    {!isLoading && (
                      <button
                        type="submit"
                        className="variable-width-btn button-su fund-campaign-btn"
                      >
                        {buttonText}
                      </button>
                    )}
                  </form>
                )}
                {!isFund && (
                  <button
                    className="variable-width-btn button-su transaction-list-btn"
                    onClick={handleList}
                  >
                    TRANSACTION HISTORY
                  </button>
                )}
                {transferDone && (
                  <button
                    className="variable-width-btn button-su transaction-list-btn"
                    onClick={handleList}
                  >
                    TRANSACTION HISTORY
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="outer">
          <div className="separate">
            <button className="one-more button-su" onClick={handleBack}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
            </button>
            <TrackTransactions
              address={props.wallet}
              escrowContract={props.escrowContract}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CampaignCardItem;
