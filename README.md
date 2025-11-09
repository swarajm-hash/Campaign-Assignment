# Campaign-Assignment
Adform Campaign Assignment

## Campaign Management System

Have built this application using React  alongwith Redux for managing campaigns with filtering and search capabilities.

## Features

- View list of campaigns with details (Name, User, Dates, Active Status, Budget)
- Search campaigns by name
- Filter campaigns by date range

## Bonus point features
- Add new campaigns through interactive form (if user name not given and clicked , "Unknown User" will be added)
- Real-time validation (camapign name cannot be empty (on submit a error will be shown), budget cannot be negative , Date validation )
- Loading states and error handling (Shows "Loading Users..." when fetching users and Error handling in `userSlice.js` extraReducers)

## Tech Stack

- React
- Redux Toolkit
- Axios
- React DatePicker
- Tailwind CSS(tailwind libraries installed but used normal css since its a simple app )

## Getting Started

### Installation

```bash
npm install
```

### Run the application

```bash
npm start
```

The app will run on http://localhost:3001

### Run tests

```bash (make sure you are in Campaign-Assignment\adform-campaigns directory . src files are under "adform-campaigns")
npm test 
```

### Build for production

```bash
npm run build
```

## Testing

The application exposes a global function `AddCampaigns` that can be called from the browser console:

```javascript
AddCampaigns([{
  id: 11,
  name: "Test Campaign",
  startDate: "1/1/2024",
  endDate: "12/31/2024",
  Budget: 1000,
  userId: 1
}]);
```
