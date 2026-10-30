
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const scholarships = [
  {
    id: 1,
    name: "National Scholarship Portal",
    education: "UG",
    category: "All",
    incomeLimit: 250000,
    amount: "Varies",
    note: "Check official eligibility"
  },
  {
    id: 2,
    name: "Merit Scholarship Demo",
    education: "UG",
    category: "All",
    incomeLimit: 500000,
    amount: "Demo amount",
    note: "Sample project data only"
  }
];

app.get("/", (req, res) => {
  res.send("ScholarPath Backend is running!");
});

app.get("/api/scholarships", (req, res) => {
  res.json(scholarships);
});

app.post("/api/eligible", (req, res) => {
  const { education, income, category } = req.body;

  const eligible = scholarships.filter((s) => {
    const educationMatch =
      !education || s.education === education;

    const incomeMatch =
      income === undefined ||
      income === "" ||
      Number(income) <= s.incomeLimit;

    const categoryMatch =
      !category ||
      s.category === "All" ||
      s.category === category;

    return educationMatch && incomeMatch && categoryMatch;
  });

  res.json(eligible);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ScholarPath server running on port ${PORT}`);
});
