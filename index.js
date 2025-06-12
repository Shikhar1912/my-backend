const express = require("express");
const { studentSchema } = require("./zodSchema/student");
const pool = require("./db");
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
let students = [];

app.post("/student", async (req, res) => {
  const result = studentSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { name, rollNumber, age, email } = result.data;
  try {
    const insertQuery = `
      INSERT INTO students (name, roll_number, age, email)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [name, rollNumber, age, email];

    const dbResult = await pool.query(insertQuery, values);

    res.status(201).json(dbResult.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Roll number already exists" });
    }
    console.error("Error inserting student:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/student/:roll", async (req, res) => {
  const roll = req.params.roll;

  try {
    const result = await pool.query(
      "SELECT * FROM students WHERE roll_number = $1;",
      [roll]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT name, roll_number FROM students;");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});