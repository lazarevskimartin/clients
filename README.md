# Client Management Mobile Web App

This project is a full-stack mobile-first web application for managing clients. It includes:

- **Frontend:** React (Vite, TypeScript), mobile-first responsive design
- **Backend:** Node.js/Express, MongoDB

## Features
- List clients (full name, address, phone number)
- Add new clients
- Mobile-first, touch-friendly UI

## Getting Started

### Prerequisites
- Node.js & npm
- MongoDB (local or Atlas)

### Setup

#### 1. Backend
```
cd backend
npm install
npm run dev
```

#### 2. Frontend
```
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and the backend API on `http://localhost:5000` by default.

## Environment Variables
- `MONGO_URI`: MongoDB connection string
- `PORT`: Backend server port

## Notes
- Make sure MongoDB is running before starting the backend.
- The frontend will need to be configured to call the backend API endpoints.
