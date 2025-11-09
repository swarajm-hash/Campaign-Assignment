import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCampaigns } from "../store/slices/campaignSlice";
import store from "../store";

const AddCampaignForm = () => {
  const dispatch = useDispatch();
  const campaigns = useSelector((state) => state.campaigns.campaigns);
  const users = useSelector((state) => state.users.users);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    Budget: "",
    userName: "",
  });

  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Name is required";
        } else {
          delete newErrors.name;
        }
        break;
      case "startDate":
        if (!value) {
          newErrors.startDate = "Start date is required";
        } else if (
          formData.endDate &&
          new Date(value) > new Date(formData.endDate)
        ) {
          newErrors.startDate = "Start date must be before end date";
        } else {
          delete newErrors.startDate;
        }
        break;
      case "endDate":
        if (!value) {
          newErrors.endDate = "End date is required";
        } else if (
          formData.startDate &&
          new Date(value) < new Date(formData.startDate)
        ) {
          newErrors.endDate = "End date must be after start date";
        } else {
          delete newErrors.endDate;
        }
        break;
      case "Budget":
        if (!value) {
          newErrors.Budget = "Budget is required";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          newErrors.Budget = "Budget must be a positive number";
        } else {
          delete newErrors.Budget;
        }
        break;
      case "userName":
        // User name is optional, no validation needed
        delete newErrors.userName;
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handlinf start date change - clear end date if new start date is after current end date
    if (name === "startDate") {
      if (formData.endDate && new Date(value) > new Date(formData.endDate)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          endDate: "",
        }));
        // Clear end date error if it exists and it will throw an error if start date is after end date
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.endDate;
          return newErrors;
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
    // Handle end date change - validate against start date
    else if (name === "endDate") {
      if (!formData.startDate) {
        alert("Select start date first");
        e.target.value = "";
        return;
      }
      if (value && new Date(value) < new Date(formData.startDate)) {
        alert("End date cannot be before start date");
        e.target.value = "";
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Handle other fields (including userName)
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    validate(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all required fields
    const validationErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "userName") {
        const value = formData[key];
        let error = null;

        switch (key) {
          case "name":
            if (!value || !value.trim()) {
              error = "Name is required";
            }
            break;
          case "startDate":
            if (!value) {
              error = "Start date is required";
            } else if (
              formData.endDate &&
              new Date(value) > new Date(formData.endDate)
            ) {
              error = "Start date must be before end date";
            }
            break;
          case "endDate":
            if (!value) {
              error = "End date is required";
            } else if (
              formData.startDate &&
              new Date(value) < new Date(formData.startDate)
            ) {
              error = "End date must be after start date";
            }
            break;
          case "Budget":
            if (!value) {
              error = "Budget is required";
            } else if (isNaN(value) || parseFloat(value) <= 0) {
              error = "Budget must be a positive number";
            }
            break;
        }

        if (error) {
          validationErrors[key] = error;
        }
      }
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Auto-generate userId based on userName
    let userId = null;

    if (formData.userName && formData.userName.trim()) {
      const trimmedUserName = formData.userName.trim();

      // Check if users are loaded and try to find matching user
      if (users && users.length > 0) {
        // Try exact match first (case-insensitive)
        let user = users.find(
          (u) => u.name.toLowerCase() === trimmedUserName.toLowerCase()
        );

      // handling the case for case mis-match or partial match
        if (!user) {
          user = users.find(
            (u) =>
              u.name.toLowerCase().includes(trimmedUserName.toLowerCase()) ||
              trimmedUserName.toLowerCase().includes(u.name.toLowerCase())
          );
        }

        if (user) {
          userId = user.id;
        } else {
          // User name not found in API - auto-generate a new userId > 10
          const currentCampaigns = store.getState().campaigns.campaigns;
          const existingUserIds = new Set(
            currentCampaigns
              .map((c) => c.userId)
              .filter((id) => id !== null && id !== undefined && id !== 0)
          );

          // Start from 11 (so that my userId is not undefined)
          let newUserId = 11;
          while (existingUserIds.has(newUserId)) {
            newUserId++;
          }

          userId = newUserId;
        }
      } else {
        //generating userId above 10
        const currentCampaigns = store.getState().campaigns.campaigns;
        const existingUserIds = new Set(
          currentCampaigns
            .map((c) => c.userId)
            .filter((id) => id !== null && id !== undefined && id !== 0)
        );

        let newUserId = 11;
        while (existingUserIds.has(newUserId)) {
          newUserId++;
        }

        userId = newUserId;
      }
    }

    const newCampaign = {
      id: campaigns.length + 1,
      name: formData.name.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      Budget: parseFloat(formData.Budget),
      userId: userId,
    };

    dispatch(addCampaigns([newCampaign]));

    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      Budget: "",
      userName: "",
    });
    setErrors({});
  };

  return (
    <div className="add-campaign-form">
      <h2>Add New Campaign(Bonus Point)</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Campaign Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "form-control error" : "form-control"}
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date *</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={errors.startDate ? "form-control error" : "form-control"}
            required
          />
          {errors.startDate && <p className="error">{errors.startDate}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date *</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            min={formData.startDate || ""}
            disabled={!formData.startDate}
            className={errors.endDate ? "form-control error" : "form-control"}
            required
          />
          {errors.endDate && <p className="error">{errors.endDate}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="budget">Budget</label>
          <input
            type="number"
            id="budget"
            name="Budget"
            value={formData.Budget}
            onChange={handleChange}
            className="form-control"
          />
          {errors.Budget && <p className="error">{errors.Budget}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className={errors.userName ? "form-control error" : "form-control"}
            placeholder="Enter user name (optional - will be 'Unknown User' if not provided)"
          />
          {errors.userName && <p className="error">{errors.userName}</p>}
        </div>
        <button type="submit" className="btn btn-primary">
          Add Campaign
        </button>
      </form>
    </div>
  );
};

export default AddCampaignForm;
