import { useEffect, useState } from "react";
import Temporary from "./Temporary";

// THIS COMPONENT IS USED TO "GET" THE REQUIRED CAMAPAIGN: PARTICULARLY, AFTER THE CAMPAIGN OWNER HAS LOGGED IN. THIS COMPONENT LOADS DATA AND SEND IT TO <Temporary /> WHERE THE REQUIRED CAMPAIGN IS FILTERED.

const GetCampaign = ({ escrowContract }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCampaigns, setLoadedCampaigns] = useState([{}]);

  const start = async () => {
    const allCampaigns = await escrowContract.getCampaigns();
    setLoadedCampaigns(allCampaigns);
    setIsLoading(false);
  };
  useEffect(() => {
    start();
  }, []);
  return (
    <>
      {!isLoading && (
        <Temporary
          campaigns={loadedCampaigns}
          escrowContract={escrowContract}
        />
      )}
    </>
  );
};
export default GetCampaign;
