const mongoose = require("mongoose");

const formDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
  email: { type: String, required: true },
  height: { type: String, required: true },
  unitheight: { type: String, required: true },
  weight: { type: String, required: true },
  unitweight: { type: String, required: true },
  sports: { type: String, required: true },
  team: { type: String, required: true },
});

const FormData = mongoose.model("FormData", formDataSchema);

module.exports = FormData;