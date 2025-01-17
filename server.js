const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const FormData = require("./FormData");
const http = require("http");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("MONGO_URI is not defined in the environment variables");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch(error => {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  });

app.get('/api/formdata', async (req, res) => {
  try {
    const formData = await FormData.find();
    res.json(formData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/formdata', async (req, res) => {
  const formData = new FormData(req.body);
  try {
    const newFormData = await formData.save();
    res.status(201).json(newFormData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/formdata/:id', async (req, res) => {
  try {
    const updatedFormData = await FormData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFormData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const port = process.env.PORT || 9000;

const server = http.createServer(app);

server.listen(port, 'localhost', () => {
  console.log(`Server running on http://localhost:${port}`);
});