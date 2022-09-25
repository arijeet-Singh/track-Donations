import React, { useState, useEffect } from "react";
import "./CampaignCard.css";
import { Redirect } from "react-router-dom";

// THIS COMPONENT RENDERS THE LOGGED IN NGO'S CAMPAIGN CARD. THIS PAGE ALSO HAS A LINK TO THE INTEGRATED PAYMENT GATEWAY WHICH IS USED TO MAKE PAYMENTS.

const SingleCard = (props) => {
  const [LogOut, setLogOut] = useState(false);
  const [amountRaised, setAmountRaised] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [gateway, setGateway] = useState(false);
  useEffect(() => {
    async function getRaisedAmount() {
      const total = await props.escrowContract.getTotalDonation(
        props.campaigns[0].wallet
      );
      setAmountRaised(parseInt(total._hex, 16) * 1e-18);
    }
    getRaisedAmount();
  }, []);
  useEffect(() => {
    async function getCurrentBalance() {
      const total = await props.escrowContract.returnMapping(
        props.campaigns[0].wallet
      );
      setCurrentBalance(parseInt(total._hex, 16) * 1e-18);
    }
    getCurrentBalance();
  }, []);
  function logOut() {
    localStorage.clear();
    setLogOut(true);
  }
  function handleGateway() {
    setGateway(true);
  }
  return (
    <>
      {!gateway && (
        <>
          <div className="single-outer">
            <div className="single-card-item">
              <div className="single-card-box table">
                <div className="single-card-preview">
                  <h2> {props.campaigns[0].ngo}</h2>
                  <h4> {props.campaigns[0].email}</h4>
                  <h4> {props.campaigns[0].phone}</h4>
                  <hr />
                </div>
                <div className="single-card-info">
                  <table className="single-table-content">
                    <tbody>
                      <tr>
                        <td className="single-table-entry-td"> Mission</td>
                        <td className="single-table-data-td">
                          <u>{props.campaigns[0].objective} </u>
                        </td>
                      </tr>
                      <tr>
                        <td className="single-table-entry-td">
                          {" "}
                          Minimum Donation
                        </td>
                        <td className="single-table-data-td">
                          <u>
                            {parseInt(props.campaigns[0].minimum._hex, 16) *
                              1e-18}{" "}
                            ETH
                          </u>
                        </td>
                      </tr>
                      <tr>
                        <td className="single-table-entry-td">
                          {" "}
                          Target Amount
                        </td>
                        <td className="single-table-data-td">
                          <u>
                            {parseInt(props.campaigns[0].target._hex, 16)} ETH
                          </u>
                        </td>
                      </tr>
                      <tr>
                        <td className="single-table-entry-td">
                          {" "}
                          Wallet Address
                        </td>
                        <td className="single-table-data-td">
                          <u>
                            {props.campaigns[0].wallet.slice(0, 10)}
                            {"..."}
                            {props.campaigns[0].wallet.slice(22, 32)}
                          </u>
                        </td>
                      </tr>
                      <tr>
                        <td className="single-table-entry-td">Amount Raised</td>
                        <td className="single-table-data-td">
                          <u>{amountRaised} ETH</u>
                        </td>
                      </tr>
                      <tr>
                        <td className="single-table-entry-td">
                          Current Balance
                        </td>
                        <td className="single-table-data-td">
                          <u>{currentBalance} ETH</u>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <button
                    className="variable-width-btn button-su transaction-list-btn"
                    onClick={logOut}
                  >
                    LOG OUT
                  </button>
                  {LogOut && <Redirect to="/landingPage" />}
                </div>
              </div>
            </div>
          </div>
          <button
            className="variable-width-btn button-su transaction-list-btn"
            onClick={handleGateway}
          >
            GO TO PAYMENT GATEWAY
          </button>
        </>
      )}
      {gateway && <Redirect to="/payment" />}
    </>
  );
};

export default SingleCard;
