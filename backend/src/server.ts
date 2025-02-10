import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  try {
    console.log("Connected to the database successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }

  console.log(`Server is running on port ${PORT}`);
});
