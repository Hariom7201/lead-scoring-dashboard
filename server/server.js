const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const LeadSchema = new mongoose.Schema({
  name: String,
  budget: Number,
  urgency: String,
  questionsAsked: Number,
  siteVisit: Boolean,
  score: String
});

const Lead = mongoose.model("Lead", LeadSchema);

function calculateScore(lead) {
  let points = 0;

  if (lead.budget >= 1000000) points += 3;
  else if (lead.budget >= 500000) points += 2;
  else points += 1;

  if (lead.urgency === "High") points += 3;
  else if (lead.urgency === "Medium") points += 2;
  else points += 1;

  if (lead.questionsAsked >= 5) points += 2;

  if (lead.siteVisit) points += 3;

  if (points >= 9) return "Hot";
  if (points >= 6) return "Warm";
  return "Cold";
}

app.post("/api/leads", async (req, res) => {
  try {
    const data = req.body;

    const lead = new Lead({
      ...data,
      score: calculateScore(data)
    });

    await lead.save();

    res.json(lead);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/api/leads", async (req, res) => {
  const leads = await Lead.find();
  res.json(leads);
});

app.delete("/api/leads/:id", async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});