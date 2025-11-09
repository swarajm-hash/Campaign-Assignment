import React, { useEffect } from "react";
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

  // Log all campaigns with their userId information
  useEffect(() => {
    console.log("=== ALL CAMPAIGNS IN TABLE ===");
    console.log(`Total campaigns: ${campaigns.length}`);
    console.log("Campaigns data:");
    campaigns.forEach((campaign, index) => {
      const userName = getUserName(campaign.userId, users);
      console.log(`${index + 1}. Campaign: "${campaign.name}"`);
      console.log(`   - ID: ${campaign.id}`);
      console.log(
        `   - userId: ${campaign.userId} (type: ${typeof campaign.userId})`
      );
      console.log(`   - User Name: "${userName}"`);
      console.log(`   - Start Date: ${campaign.startDate}`);
      console.log(`   - End Date: ${campaign.endDate}`);
      console.log(`   - Budget: ${campaign.Budget}`);
      console.log("   ---");
    });
    console.log("=== END OF CAMPAIGNS LIST ===");
  }, [campaigns, users]);

  const filteredCampaigns = getAllFilteredCampaigns(
    campaigns,
    searchTerm,
    dateRange
  );

  return (
    <div className="campaigns-list">
      {filteredCampaigns.length === 0 && campaigns.length > 0 && (
        <div style={{ padding: "10px", color: "#666", fontStyle: "italic" }}>
          No campaigns match the current filters. Clear search or date range to
          see all campaigns.
        </div>
      )}
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
            // Debug: Log userId for troubleshooting
            if (
              campaign.name === "Test Campaign" ||
              campaign.name.includes("No User")
            ) {
              console.log(
                `Campaign "${campaign.name}" - userId:`,
                campaign.userId,
                `(type: ${typeof campaign.userId})`,
                `- Will show:`,
                getUserName(campaign.userId, users)
              );
            }
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
