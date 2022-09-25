import React, { useState } from "react";
import DonorOrNGO from "./components/DonorOrNGO";
import { Switch, Route, Redirect } from "react-router-dom";
import SignUpAsDonor from "./components/Auth/SignUpAsDonor";
import SignUpAsNGO from "./components/Auth/SignUpAsNGO";
import LogInAsDonor from "./components/Auth/LogInAsDonor";
import LogInAsNGO from "./components/Auth/LogInAsNGO";
import Navbar from "./components/Navbar";
import GetCampaign from "./components/createCampaign/GetCampaign";
import Heading2 from "./components/Heading2";
import Navbar2 from "./components/Navbar2";
import Heading from "./components/Heading";
import CreateCampaignForm from "./components/createCampaign/CreateCampaignForm";
import CurrentAccount from "./components/CurrentAccount";
import AllCampaigns from "./components/createCampaign/AllCampaigns";
import PaymentGateway from "./components/createCampaign/PaymentGateway";
import Heading3 from "./components/Heading3";
import {
  escrowABI,
  escrowAddress,
} from "./components/escrowContract/constants";
import { ethers } from "ethers";

function App() {
  // LINE 28 TO 41 MAKE SURE USER CONNECTS METAMASK WALLET BEFORE PROCEEDING.

  const { ethereum } = window;
  const [currentAccount, setCurrentAccount] = useState("");
  ethereum.on("accountsChanged", function () {
    window.location.reload();
  });
  async function connectWallet() {
    if (typeof ethereum !== "undefined") {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    }
  }
  connectWallet();

  // LINE 45 TO 55 INSTANTIATE THE CONTRACT. WHICH IS PASSED TO ALL THE COMPONENTS WHICH REQUIRE THE CONTRACT, VIA PROPS.

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

  return (
    <>
      <div>
        <Switch>
          <Route path="/" exact>
            <Navbar />
            <Redirect to="/landingPage" />
          </Route>
          <Route path="/landingPage">
            <Navbar />
            <DonorOrNGO />
            <CurrentAccount currentAccount={currentAccount} />
          </Route>
          <Route path="/suD">
            <Navbar />
            <SignUpAsDonor />
          </Route>
          <Route path="/suN">
            <Navbar />
            <SignUpAsNGO />
          </Route>
          <Route path="/liD">
            <Navbar />
            <LogInAsDonor />
          </Route>
          <Route path="/liN">
            <Navbar />
            <LogInAsNGO />
          </Route>
          <Route path="/cmcF">
            <Navbar />
            <CreateCampaignForm escrowContract={escrowContract} />
          </Route>
          <Route path="/homePage">
            <Navbar />
            <Heading />
            <Navbar2 />
            <AllCampaigns escrowContract={escrowContract} />
          </Route>
          <Route path="/yourCampaign">
            <Heading2 />
            <GetCampaign escrowContract={escrowContract} />
          </Route>
          <Route path="/payment">
            <Heading3 />
            <PaymentGateway escrowContract={escrowContract} />
          </Route>
        </Switch>
      </div>
    </>
  );
}
export default App;
