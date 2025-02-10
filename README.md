# Project Setup Instructions

## Backend Setup

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (Latest LTS version recommended)
- npm or yarn (package manager)
- MongoDB (or any preferred database)

### Installation Steps

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/Kashifraza1208/log-reg-infloso.git
   cd backend
   ```

2. **Install Dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables:**
   already setup

   ### Prisma Setup

4. **Run Database Migrations:**

   ```sh
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client:**

   ```sh
   npx prisma generate
   ```

6. **Run the Backend Server:**

   ```sh
   npm run dev  # Runs in development mode
   # or
   yarn dev
   ```

7. **API Endpoints Available:**

   - `POST /api/v1/register` - User registration
   - `POST /api/v1/login` - User login
   - `POST /api/v1/logout` - User logout
   - `POST /api/v1/verify/email/:token` - Email verification
   - `POST /api/v1/forgot/password` - Request password reset (email sent)
   - `POST /api/v1/reset/password/:token` - Reset password
   - `POST /api/v1/refresh-token` - Refresh authentication token
   - `GET /api/v1/me` - Fetch authenticated user details
  
7. **View Data in pgAdmin:**
   - Open `pgAdmin`
   - Connect to your PostgreSQL database
   - Navigate to your database schema and view tables/data


## Frontend Setup

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (Latest LTS version recommended)
- npm or yarn (package manager)

### Installation Steps

1. **Navigate to the Frontend Directory:**

   ```sh
   cd frontend
   ```

1. **Install Dependencies:**

   ```sh
   npm install or npm install --legacy-peer-deps
   # or
   yarn install
   ```

1. **Set Up Environment Variables:**
   already setup

1. **Run the Frontend Application:**

   ```sh
   npm run dev  # Runs in development mode
   # or
   yarn dev
   ```

1. **Project Features Implemented:**

   - **Login & Signup Pages** with form validation and Redux Toolkit for state management
   - **Email Verification & Forgot Password** workflows
   - **JWT Authentication with Refresh Token support**
   - **Secure Password Hashing with bcrypt**
   - **Prisma ORM for Secure Database Interactions** (Preventing SQL Injection & XSS)
   - **Responsive Design using Tailwind CSS**
   - **Toast notifications for success and error messages**

Now, visit `http://localhost:5173` (or the provided dev server URL) to access the frontend.
