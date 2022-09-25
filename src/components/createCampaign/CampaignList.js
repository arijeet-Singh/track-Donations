import CampaignCardItem from "./CampaignCardItem";
import { v4 as uuidv4 } from "uuid";

//THIS COMPONENT MAPS THROUGH ALL THE CAMPAIGNS AND FOR EACH CAMPAIGN, IT RENDERS THE <CampaignCardItem /> COMPONENT TO DISPLAY THE INFORMATION ON THE MAIN PAGE.

const CampaignList = (props) => {
  return (
    <div className="super-con">
      <ul>
        {props.campaigns &&
          props.campaigns.map((campaign) => (
            <CampaignCardItem
              key={uuidv4()}
              id={uuidv4()}
              email={campaign.email}
              phone={campaign.phone}
              ngo={campaign.ngo}
              objective={campaign.objective}
              minimum={parseInt(campaign.minimum._hex, 16) * 1e-18}
              target={parseInt(campaign.target._hex, 16)}
              wallet={campaign.wallet}
              escrowContract={props.escrowContract}
            />
          ))}
      </ul>
    </div>
  );
};
export default CampaignList;
