import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./TrackTransactions.css";
function TrackTransactions(props) {
  const { ethereum } = window;
  const [currentAccount, setCurrentAccount] = useState("");
  const [filteredData, setFilteredData] = useState([
    {
      from: "",
      to: "",
      vendorName: "",
      vendorLocation: "",
      date: "",
      amount: "",
    },
  ]);

  useEffect(() => {
    async function details() {
      const details = await props.escrowContract.getDetails(); // GET ALL THE PAYMENT DETAILS.
      const filteredDetail = details.filter((element) => {
        return element.from === props.address.toLowerCase();
        //FILTER OUT ALL THOSE INSTANCES IN WHICH THE PAYEE (SENDER) IS THE ADDRESS WHOSE TRANSACTION HISTORY WE WANT
      });
      setFilteredData(filteredDetail.reverse());
      //REVERSE BECAUSE WE WANT THE LATEST TRANSACTION TO BE DISPLAYED FIRST.
    }
    details();
  }, []);

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

  return (
    <>
      <h1 className="selected">Transaction History</h1>
      <div className="container6">
        <div className="outer6">
          {filteredData.length >= 1 && (
            <div className="selected-NGO" key={uuidv4()}>
              {filteredData.map(
                (
                  datum // MAP THROUGH THE PAYMENT DETAILS AND FORM A TABLE FOR EACH TRANSACTION.
                ) => (
                  <div className="api" key={uuidv4()}>
                    {datum.from === props.address.toLowerCase() && (
                      <div className="internal" key={uuidv4()}>
                        <table className="unordered">
                          <tbody>
                            <tr>
                              <td className="tx-details">FROM:</td>
                              <td>{datum.from}</td>
                            </tr>
                            <tr>
                              <td className="tx-details">TO:</td>
                              <td>{datum.to}</td>
                            </tr>
                            <tr>
                              <td className="tx-details">VENDOR NAME:</td>
                              <td>{datum.vendorName}</td>
                            </tr>
                            <tr>
                              <td className="tx-details">LOCATION:</td>
                              <td>{datum.vendorLocation}</td>
                            </tr>
                            <tr>
                              <td className="tx-details">VALUE:</td>
                              <td>{parseFloat(datum.amount).toString()} ETH</td>
                            </tr>
                            <tr>
                              <td className="tx-details">DATE:</td>
                              <td>{datum.date}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
          {filteredData.length === 0 && <p className="no-data">NO DATA</p>}
        </div>
      </div>
    </>
  );
}
export default TrackTransactions;
