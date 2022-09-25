import React from "react";
import SingleCard from "./SingleCard";
export default function Temporary({campaigns, escrowContract}) {
  const email = JSON.parse(localStorage.getItem("userEmail"));
  const filteredCampaign = campaigns.filter((element) => {
    return element.email === email;
  });
  return (
    <div className="filter">
      <SingleCard campaigns={filteredCampaign} escrowContract={escrowContract} />
    </div>
  );
}
