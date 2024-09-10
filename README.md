# Ethereum Deposit Tracker

This project tracks Ethereum beacon chain deposits and provides a Prometheus metrics REST API.

## Prerequisites

- Node.js (version 14 or later recommended)
- npm (comes with Node.js)
- MongoDB

## Setup

1. Clone the repository:
   
   git clone https://github.com/your-username/eth-deposit-tracker.git
   cd eth-deposit-tracker
   

2. Install dependencies:
   
   npm install
   

3. Set up environment variables:
   - Copy the .env.example file to .env
   - Edit the .env file and add your MongoDB connection string:
     
     MONGO_URI=mongodb+srv://your-username:your-password@your-cluster-url/your-database
     

## Available Scripts

In the project directory, you can run:

### npm run build

Compiles the TypeScript code to JavaScript.

### npm run dev

Runs the Ethereum Beacon Deposits Tracker in development mode with hot reloading.

### npm run dev-api

Runs the Prometheus Metrics REST API in development mode with hot reloading.

## Project Structure

- src/apps/ethBeaconDepositsTracker: Contains the main tracker application
- src/apps/prometheusMetricsRestApi: Contains the Prometheus metrics REST API
- src/database: Database connection and models

## Technologies Used

- TypeScript
- Express.js
- Mongoose (MongoDB ODM)
- Ethers.js
- Prometheus client
- Telegraf (for Telegram bot integration)
- Zod (for schema validation)

  ![WhatsApp Image 2024-09-10 at 22 29 28_26e2324a](https://github.com/user-attachments/assets/f1d04ca8-42c8-4e50-b173-072e0c23ca0b)

![WhatsApp Image 2024-09-10 at 22 31 09_e9644cf2](https://github.com/user-attachments/assets/94d8a7db-bdb1-447c-b313-29bfff4a1ab0)
![WhatsApp Image 2024-09-10 at 22 32 00_1552025d](https://github.com/user-attachments/assets/f22fa2bc-d7e5-4034-87ef-8cd63aa1e21a)
![WhatsApp Image 2024-09-10 at 22 32 15_1d9563ed](https://github.com/user-attachments/assets/5bfec9df-05cd-44ef-b73c-398d14f3e985)
![WhatsApp Image 2024-09-10 at 22 32 37_43bc3bb3](https://github.com/user-attachments/assets/aa35a2c8-d0e9-4d27-a018-750c8704e5ec)

