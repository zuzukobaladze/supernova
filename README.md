# Supernova Task

This project is a full-stack application demonstrating authentication using GraphQL. It includes both frontend and backend components.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application Locally](#running-the-application-locally)

## Prerequisites

- Node.js (>=12.x)
- npm or yarn
- SQLite (for the database)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/zuzukobaladze/supernova.git
    cd supernova
    ```

2. Install dependencies for both frontend and backend:
    ```sh
    # For the backend
    cd backend
    npm install

    # For the frontend
    cd frontend
    npm install
    ```

## Running the Application Locally

### Backend

1. Navigate to the backend directory:
    ```sh
    cd backend
    ```

1. Make sure you have .env file in backend directory. Create it and add these values:
    ```sh
    cd backend
    touch .env
    ```
    Paste these into .env file:
    `PORT=4000` (or any other port number, just make sure there is nothing running on that port number)
    `JWT_SECRET=YOUR_JWT_SECRET_VALUE`

    To generate YOUR_JWT_SECRET, run this command from terminal:
    ```sh
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
    ```
    Put the result as value in JWT_SECRET.


2. Start the backend server:
    ```sh
    npm start
    ```

3. The backend server will be running at `http://localhost:PORT`.

### Frontend

1. Navigate to the frontend directory in a new terminal window/tab:
    ```sh
    cd frontend
    ```

2. Start the frontend server:
    ```sh
    npm start
    ```

3. Open your browser and go to `http://localhost:3000`.
