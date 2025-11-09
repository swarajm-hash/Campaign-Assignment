# Campaign-Assignment
Adform Campaign Assignment

## Campaign Management System

A React application built with Redux for managing campaigns with filtering and search capabilities.

## Features

- View list of campaigns with details (Name, User, Dates, Active Status, Budget)
- Search campaigns by name
- Filter campaigns by date range
- Add new campaigns through interactive form
- Real-time validation
- Loading states and error handling

## Tech Stack

- React
- Redux Toolkit
- Axios
- React DatePicker
- Tailwind CSS

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

```bash
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
