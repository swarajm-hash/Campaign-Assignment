import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store";
import { addCampaigns } from "./store/slices/campaignSlice";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

window.AddCampaigns = (campaignsArr) => {
  if (Array.isArray(campaignsArr)) {
    //  finding the highest id and userId
    const currentCampaigns = store.getState().campaigns.campaigns;

    // Find highest campaign id
    const highestId = currentCampaigns.reduce((max, campaign) => {
      if (campaign.id && campaign.id > max) {
        return campaign.id;
      }
      return max;
    }, 0);

    // Find highest userId from existing campaigns to avoid overlap
    // Users API has IDs 1-10, so assigning id > 10 to show "Unknown User"
    const highestUserId = currentCampaigns.reduce((max, campaign) => {
      // Only consider valid userIds (not null, undefined, or 0)
      if (campaign.userId && campaign.userId > max) {
        return campaign.userId;
      }
      return max;
    }, 10); 

    // Get all existing userIds to check for overlaps
    const existingUserIds = new Set(
      currentCampaigns
        .map((c) => c.userId)
        .filter((id) => id !== null && id !== undefined && id !== 0)
    );

    // Normalize campaigns: auto-assign id and userId if not provided
    const normalizedCampaigns = campaignsArr.map((campaign, index) => {
      const normalized = { ...campaign };

      // Auto-generate id if not provided
      if (
        !("id" in campaign) ||
        campaign.id === undefined ||
        campaign.id === null
      ) {
        normalized.id = highestId + 1 + index;
      }

      // Auto-assign userId if not provided (assign value > 10 to ensure "Unknown User" and no overlap)
      if (
        !("userId" in campaign) ||
        campaign.userId === undefined ||
        campaign.userId === null
      ) {
        // Start from max(highestUserId, 10) + 1 to ensure:
        // 1. It's > 10 (so it doesn't exist in users API - shows "Unknown User")
        // 2. It's > highest existing userId (no overlap with existing campaigns)
        let newUserId = Math.max(highestUserId, 10) + 1 + index;

        // Ensure no overlap with existing userIds (check all existing, not just highest)
        while (existingUserIds.has(newUserId)) {
          newUserId++;
        }

        normalized.userId = newUserId;
        existingUserIds.add(newUserId); 
      }

      return normalized;
    });

    store.dispatch(addCampaigns(normalizedCampaigns));
    return true;
  } else {
    console.error(
      "AddCampaigns expects an array. Received:",
      typeof campaignsArr
    );
    return false;
  }
};


reportWebVitals();
