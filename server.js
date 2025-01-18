const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const FormData = require("./FormData");
const http = require("http");
const morgan = require("morgan");

dotenv.config();

const app = express();


app.use(morgan("combined"));


console.log("MONGO_URI:", "sucess");
console.log("PORT:", process.env.PORT);
console.log("Origin:", process.allowedOrigins);


const allowedOrigins = [
    "http://localhost:5174",
    "https://sportsform.azurewebsites.net/formdata",
    "https://mango-sea-0d38e9600.4.azurestaticapps.net",
    ];


    app.use(cors({ origin: "*" }));

    

// app.use(cors({origin: [allowedOrigins], credentials: true, methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"]}));

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
        res.status(500).json({ message: "Error fetching form data", error: error.message });
    }
});


app.get("/health", (req, res) => {
    res.status(200).send("Healthy");
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


process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
});
