import { useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { ethers } from "ethers";
import "./CreateMyCampaignForm.css";
const CreateCampaignForm = ({escrowContract}) => {

  const [created, setCreated] = useState(false);
  const [logIn, setLogIn] = useState(false);
  const [buttonText, setButtonText] = useState("CREATE CAMPAIGN");

  const emailInputRef = useRef();
  const phoneInputRef = useRef();
  const ngoNameRef = useRef();
  const objectiveRef = useRef();
  const minimumDonationRef = useRef();
  const targetAmountRef = useRef();
  const walletAddressRef = useRef();

  function handleLogIn() {
    setLogIn(true);
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPhone = phoneInputRef.current.value;
    const enteredNGO = ngoNameRef.current.value;
    const enteredObjective = objectiveRef.current.value;
    const enteredMinimum_1 = ethers.utils.parseEther(
      minimumDonationRef.current.value
    );
    const enteredMinimum_2 = parseInt(enteredMinimum_1._hex,16);
    const enteredTarget = targetAmountRef.current.value;
    const enteredWallet = walletAddressRef.current.value;
    const escrowHash = await escrowContract.addCampaign( //USING THE CONTRACT FUNCTION TO STORE THE CAMPAIGN DETAILS.
      enteredEmail,
      enteredMinimum_2,
      enteredNGO,
      enteredObjective,
      enteredPhone,
      enteredTarget,
      enteredWallet
    );
    setButtonText("CREATING CAMPAIGN...");
    await escrowHash.wait();
    await escrowContract.getCampaigns();
    setCreated(true);
    setButtonText("CAMPAIGN CREATED. LOG IN.");
  };

  return (
    <div className="container-super">
      <section className="create-campaign">
        <h1>CREATE YOUR CAMPAIGN</h1>
        <form onSubmit={submitHandler}>
          <div className="control">
            <input
              id="info-mail"
              className="contact"
              type="email"
              placeholder="Email"
              required
              autoComplete="off"
              ref={emailInputRef}
            ></input>

            <input
              id="info-phone"
              type="text"
              className="contact"
              placeholder="Phone Number"
              required
              autoComplete="off"
              ref={phoneInputRef}
            ></input>
          </div>
          <div className="control">
            <input
              id="name-ngo-individual"
              type="text"
              className="NGO"
              placeholder="Name (NGO/Individual)"
              required
              autoComplete="off"
              ref={ngoNameRef}
            ></input>
          </div>
          <div className="control">
            <input
              id="misson-objective"
              type="text"
              className="objective"
              placeholder="Mission/Objective"
              required
              autoComplete="off"
              ref={objectiveRef}
            ></input>
          </div>
          <div className="control min-do">
            <input
              id="minimum-donation"
              type="number"
              className="min"
              step={0.00000000001}
              min={0.00000000001}
              required
              placeholder="Minimum Donation in ETH"
              ref={minimumDonationRef}
            ></input>
          </div>
          <div className="control t-amo">
            <input
              id="target-amount"
              type="number"
              className="target"
              step={0.00000000001}
              min={0.00000000001}
              required
              autoComplete="off"
              placeholder="Target Amount"
              ref={targetAmountRef}
            ></input>
          </div>
          <div className="control">
            <input
              id="metamask-wallet-address"
              type="address"
              className="waddress"
              placeholder="MetaMask Wallet Address"
              required
              autoComplete="off"
              ref={walletAddressRef}
            ></input>
          </div>
          {!created && (
            <button className="button-su transaction-list-btn" type="submit">
              {buttonText}
            </button>
          )}
          {created && (
            <button
              className="button-su transaction-list-btn"
              onClick={handleLogIn}
              type="button"
            >
              {buttonText}
            </button>
          )}
        </form>
      </section>
      {logIn && <Redirect to="/liN" />}
    </div>
  );
};

export default CreateCampaignForm;
