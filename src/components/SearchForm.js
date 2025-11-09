import React from "react";
import { useDispatch } from "react-redux";
import { setSearchTerm } from "../store/slices/campaignSlice";

const SearchForm = () => {
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <div className="search-form">
      <input
        type="text"
        placeholder="Search campaigns..."
        onChange={handleSearch}
        className="search-input"
      />
      <button type="button" className="search-button">
        🔍
      </button>
    </div>
  );
};

export default SearchForm;
