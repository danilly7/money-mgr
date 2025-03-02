# SPRINT 9 - Project: Moneymgr
## About

**Moneymgr** is a simple yet powerful application designed to help you manage your money efficiently. With an intuitive interface, you can track your income, expenses and balances with ease.

<br>

## Application

<p align="center">
  <img src="https://github.com/user-attachments/assets/330ed2ce-2be5-4e42-85a6-c82d4cf8b550" width="250" />
  <img src="https://github.com/user-attachments/assets/e2abbb7f-5219-4acd-b5f1-e7c339dd0563" width="250" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/51e07bc7-8dd1-4298-a3c6-9afd00156b4e" width="250" />
  <img src="https://github.com/user-attachments/assets/4ebe6a36-f0fc-4208-9ad9-f640f5a49bcb" width="249" />
</p>

<p align="center">
  <em>Here are snippets of the application in mobile mode.</em>
</p>

<br>

<p align="center">
  <a href="https://youtu.be/v4LD0aTYUHM">
    <img src="https://img.youtube.com/vi/v4LD0aTYUHM/0.jpg" alt="Watch the video" />
  </a>
</p>
<p align="center">
  <em>And here is a small demo of Moneymgr.</em>
</p>

<br>

## Technologies Used

### Backend:
- **Node.js**
- **Express**
- **MySQL**
- **Nodemon**
- **TypeScript** (TS)
- **Sequelize** (for database synchronization)

### Frontend:
- **React**
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- **React Context API**

### Tools & APIs:
- **Vite** (for bundling and dev server)
- **Firebase** (for login and register)
- **Postman** (for testing API endpoints)

<br>

## Main Features

### Frontend (Client-side)
- [x] **User Authentication** (with Firebase) 
- [x] **Protected Access** (only logged-in users)  
- [x] **Accounts Management**
- [x] **Transactions Tracking**
- [x] **Automatic Balance Calculation**
- [x] **Category-Based Filtering**  
- [x] **Custom Account Visibility**
- [x] **Fully Responsive Design** 
- [x] **Reusable UI Components** 
- [x] **Dynamic URL Parameters**  
- [x] **Centralized & Dynamic Routing**  

### Backend (Server-side)
- [x] **RESTful API** (for accounts, categories and transactions)
- [x] **User Management** (Firebase + DB)  
- [x] **Authentication Integration** 
- [x] **Node.js & Express**
- [x] **MySQL Database**
- [x] **Sequelize ORM** 

### To-Do / Planned Features
- [ ] **Transfers CRUD**: Allow users to transfer money between accounts.  
- [ ] **Custom Categories**: Enable users to create, edit, and delete their own categories (currently predefined).  
- [ ] **Financial Graphs**: Add interactive charts to visualize income, expenses and trends.  
- [ ] **Personalized User Profile**: Allow users to upload a profile picture and update their profile data (email cannot be changed).  
- [ ] **Password Reset**: The function is already implemented; needs UI integration in the frontend.  
- [ ] **Customizable Categories**: Let users choose category colors and select from a set of icons.  

<br>

## Installation

1. Clone the repository   

    ```bash
    git clone https://github.com/danilly7/money-mgr.git
    cd money-mgr
    ```

    <br>

2. Make sure you have Node.js installed  

    Check if you have it installed on your machine (preferably version 16.x.x or higher):  

    ```bash
    node -v
    ```

    If needed, you can download it from [here](https://nodejs.org/en).  

    <br>

3. Set up the backend  

- **Database Setup**  

  - Install and configure XAMPP:  

    If needed, you can download it from [here](https://www.apachefriends.org/download.html).  

    Once installed, launch the XAMPP Control Panel and start the **Apache** and **MySQL** services.  

  - The backend expects a MySQL database named **moneymgr**.  

    Make sure to create this database in your MySQL server before running the backend.  

    You can create the database using phpMyAdmin or by running the following SQL query:  

    ```sql
    CREATE DATABASE moneymgr;
    ```

- **Server Setup**  

  - Navigate to the backend directory:  

    ```bash
    cd backend
    ```

  - Create the `.env` file:  

    Copy the `.env.example` file and create a new `.env` file in the backend folder.  

    - This file must include **database credentials** and **Firebase configurations**.  

  - Run the backend server:  

    Once the database is created and the `.env` file is configured, start the backend server:  

    ```bash
    npm run dev
    ```

    <br>

4. Set up Firebase  

The authentication system is handled by Firebase. Follow these steps to set it up:  

- Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.  
- In the **Project settings**, go to the **General** tab and find your Firebase configuration.  
- Copy the Firebase credentials and add them to the `.env` file in both **backend** and **frontend**:  

  - Backend `.env` should include:  

    ```
    FIREBASE_API_KEY=your-api-key
    FIREBASE_AUTH_DOMAIN=your-auth-domain
    FIREBASE_PROJECT_ID=your-project-id
    FIREBASE_STORAGE_BUCKET=your-storage-bucket
    FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    FIREBASE_APP_ID=your-app-id
    ```

  - Frontend `.env` should also include the Firebase configuration.

    <br>

5. Set up the frontend  

- Navigate to the frontend directory:  

    ```bash
    cd frontend
    ```

- Create the `.env` file and provide the Firebase credentials (same as backend). Follow the lead of `.env.example` file.  

- Install the frontend dependencies:  

    ```bash
    npm install
    ```

- Run the frontend development server:  

    ```bash
    npm run dev
    ```

    <br>

6. Access the project  

   Once both the frontend and backend servers are running, open your browser and navigate to the URL provided by the frontend server. The URL will typically be:  

    ```bash
    Local: http://localhost:5174/
    ```

    <br>

### Notes  

- Ensure that the `.env` files for both the backend and frontend are correctly set up with the **Firebase API keys** and **database credentials**.  
- The backend `.env.example` file includes database connection settings and Firebase credentials.  
- **Authentication is managed through Firebase**, meaning users must be logged in to access the application.  

<br>

## Author

#### Danilly Condori Lerpido - [GitHub](https://github.com/danilly7)
