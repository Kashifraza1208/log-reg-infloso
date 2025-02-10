```markdown
# React + TypeScript + Vite

This project is a React application built with TypeScript and Vite. Follow the steps below to set up and run the project locally.

---

## Instructions for Setting Up the Project

### 1. Clone the Frontend Repository
To get started, open your terminal and clone the repository with the following command:

```bash
git clone https://github.com/abstrabit-tech/intellidev-frontend
```

---

### 2. Navigate to the Frontend Directory
Once the repository has been cloned, navigate into the frontend directory:

```bash
cd intellidev-frontend
```

---

### 3. Install Dependencies
Install the necessary dependencies by running:

```bash
npm install
```

---

### 4. Configure the Environment Variables
Create a `.env` file in the root of the project directory and add the following environment variable:

```env
VITE_APP_BASE_URL=<Your Base API URL>
```

Replace `<Your Base API URL>` with the base URL of your API server. For example:

```env
VITE_APP_BASE_URL=http://localhost:8000
```

---

### 5. Run the Frontend Application
After setting up the `.env` file and installing the dependencies, start the development server with:

```bash
npm run dev
```

The application will start on a local server, typically available at:  
[http://localhost:5173](http://localhost:5173)

---

### Notes
- Ensure that the backend API is running and accessible at the URL specified in `VITE_APP_BASE_URL`.
- For production, update the `.env` file with the appropriate environment variables.
