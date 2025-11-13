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
  if (!Array.isArray(campaignsArr)) {
    console.error(
      "AddCampaigns expects an array. Received:",
      typeof campaignsArr
    );
    return false;
  }

  const normalizedCampaigns = campaignsArr.map((campaign) => {
    const normalized = { ...campaign };

    if (
      !(campaign.userId) ||
      campaign.userId === undefined ||
      campaign.userId === null
    ) {
      normalized.userId = null;
    }


    return normalized;
  });

  store.dispatch(addCampaigns(normalizedCampaigns));
  return true;
};

reportWebVitals();
