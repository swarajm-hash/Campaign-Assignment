import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "./store/slices/userSlice";
import SearchForm from "./components/SearchForm";
import DateRange from "./components/DateRange";
import CampaignsList from "./components/CampaignsList";
import AddCampaignForm from "./components/AddCampaignForm";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.users.loading);
  const error = useSelector((state) => state.users.error);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="App">
      <h1>Campaigns Management System</h1>
      {loading && <div className="loading">Loading Users...</div>}
      {error && <div className="error">Error: {error}</div>}
      <div>
        <AddCampaignForm />
      </div>
      <div className="filters-container">
        <DateRange />
        <SearchForm />
      </div>

      <CampaignsList />
    </div>
  );
}

export default App;
