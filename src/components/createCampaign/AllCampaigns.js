import { useEffect, useState } from "react";
import CampaignList from "./CampaignList";
let allCampaigns;

  // THIS COMPONENT REFERENCES THE BLOCKCHAIN AND RETRIEVES THE DATA OF ALL CAMPAIGNS STORED IN THE BLOCKCHAIN.
  // IT PASSES THE DETAILS OF THE CAMPAIGNS TO THE <CampaignList/> COMPONENT.

const AllCampaigns = ({ escrowContract }) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      allCampaigns = await escrowContract.getCampaigns();
      setIsLoading(false);
    })();
  }, []);

  return (
    !isLoading && (
      <CampaignList campaigns={allCampaigns} escrowContract={escrowContract} />
    )
  );
};
export default AllCampaigns;
