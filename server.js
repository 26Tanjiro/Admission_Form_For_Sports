const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const FormData = require("./FormData"); 
const http = require('http');
   

dotenv.config();

const app = express();

console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("PORT:", process.env.PORT);

const allowedOrigins = [
  "http://localhost:5173",
  "https://sportsform.azurewebsites.net",
  "https://mango-sea-0d38e9600.4.azurestaticapps.net"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
  credentials: true
}));

app.use(bodyParser.json());

app.post("/api/formdata", async (req, res) => {
  try {
    const formData = new FormData(req.body);
    await formData.save();
    res.status(200).json({ message: "Form data saved successfully", _id: formData._id });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ message: "Error saving form data", error: error.message });
  }
});

app.put("/api/formdata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFormData = await FormData.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedFormData) {
      return res.status(404).json({ message: "Form data not found" });
    }
    res.status(200).json({ message: "Form data updated successfully", data: updatedFormData });
  } catch (error) {
    console.error("Error updating form data:", error);
    res.status(500).json({ message: "Error updating form data", error: error.message });
  }
});

app.get("/api/formdata", async (req, res) => {
  try {
    const formData = await FormData.find();
    res.json(formData);
  } catch (error) {
    console.error("Error fetching form data:", error);
    res.status(500).json({ message: "Error fetching form data" });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  });

const port = process.env.PORT || 8080;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});