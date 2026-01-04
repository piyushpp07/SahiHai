const mongoose = require("mongoose");

const ApplianceSchema = new mongoose.Schema({
  brand: String,
  model: String,
  serial: String,
  manufacture_date: String,
  age_years: Number,
  is_warranty_likely_expired: Boolean,
  maintenance_tip: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appliance", ApplianceSchema);
