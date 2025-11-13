export const formatDate = (date) => {
  if (!date) return "";

  let dateNew = new Date(date);

  const day = dateNew.getDate().toString().padStart(2, "0");
  const month = (dateNew.getMonth() + 1).toString().padStart(2, "0");
  const year = dateNew.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatBudget = (budget) => {
  if (!budget) return "";

  const budgetValue = Number(budget);

  if (budgetValue >= 1000000) {
    const millions = budgetValue / 1000000;
    return `${millions.toFixed(2)}M USD`;
  } else if (budgetValue >= 1000) {
    const thousands = budgetValue / 1000;
    return `${thousands.toFixed(2)}K USD`;
  } else {
    return `${budgetValue.toFixed(2)} USD`;
  }
};

export const ifCampaignActive = (startDate, endDate) => {
  if (!startDate || !endDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  if (start <= today && end >= today) {
    return true;
  } else {
    return false;
  }
};

export const getUserName = (userId, users) => {
  if (userId === null || userId === undefined || userId === 0) {
    return "Unknown User";
  }

  if (!users || !Array.isArray(users) || users.length === 0) {
    return "Unknown User";
  }

  const user = users.find((user) => user.id === userId);

  if (!user || !user.name) {
    return "Unknown User";
  }
  return user.name;
};

export const filterCampaigns = (campaigns, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === "") return campaigns;

  return campaigns.filter((campaign) => {
    const campaignName = campaign.name.toLowerCase();
    const search = searchTerm.toLowerCase();
    return campaignName.includes(search);
  });
};

export const filterByDateRange = (campaigns, startDate, endDate) => {
  if (!startDate || !endDate) return campaigns;

  const start = new Date(startDate);
  if (isNaN(start.getTime())) return campaigns;
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  if (isNaN(end.getTime())) return campaigns;
  end.setHours(0, 0, 0, 0);

  if (end < start) return [];

  return campaigns.filter((campaign) => {
    if (!campaign.startDate || !campaign.endDate) return false;

    const campaignStart = new Date(campaign.startDate);
    if (isNaN(campaignStart.getTime())) return false;
    campaignStart.setHours(0, 0, 0, 0);

    const campaignEnd = new Date(campaign.endDate);
    if (isNaN(campaignEnd.getTime())) return false;
    campaignEnd.setHours(0, 0, 0, 0);

    if (campaignEnd < campaignStart) return false;

    const startInRange = campaignStart >= start && campaignStart <= end;

    const endInRange = campaignEnd >= start && campaignEnd <= end;

    return startInRange || endInRange;
  });
};

export const getAllFilteredCampaigns = (campaigns, searchTerm, dateRange) => {
  let filtered = [...campaigns];

  filtered = filterCampaigns(filtered, searchTerm);

  if (dateRange.startDate && dateRange.endDate) {
    filtered = filterByDateRange(
      filtered,
      dateRange.startDate,
      dateRange.endDate
    );
  }

  return filtered;
};
