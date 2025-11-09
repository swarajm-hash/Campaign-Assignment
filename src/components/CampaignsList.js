import React from "react";
import { useSelector } from "react-redux";
import {
  formatDate,
  formatBudget,
  ifCampaignActive,
  getUserName,
  getAllFilteredCampaigns,
} from "../utils/helpers";

const CampaignsList = () => {
  const campaigns = useSelector((state) => state.campaigns.campaigns);
  const users = useSelector((state) => state.users.users);
  const dateRange = useSelector((state) => state.campaigns.dateRange);
  const searchTerm = useSelector((state) => state.campaigns.searchTerm);

  const filteredCampaigns = getAllFilteredCampaigns(
    campaigns,
    searchTerm,
    dateRange
  );

  return (
    <div className="campaigns-list">
      <table className="campaigns-table">
        <thead>
          <tr>
            <th>Campaign Name</th>
            <th>User Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Active</th>
            <th>Budget</th>
          </tr>
        </thead>
        <tbody>
          {filteredCampaigns.map((campaign) => {
            const isActive = ifCampaignActive(
              campaign.startDate,
              campaign.endDate
            );
            return (
              <tr key={campaign.id}>
                <td>{campaign.name}</td>
                <td>{getUserName(campaign.userId, users)}</td>
                <td>{formatDate(campaign.startDate)}</td>
                <td>{formatDate(campaign.endDate)}</td>
                <td>
                  <span
                    className={isActive ? "status-active" : "status-inactive"}
                  >
                    <span className="status-dot"></span>
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{formatBudget(campaign.Budget)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignsList;
