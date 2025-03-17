// server.js
import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Set up PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING || "postgres://localhost:5432/mydb",
});

// Ensure the tax_responses table exists
pool.query(`
  CREATE TABLE IF NOT EXISTS tax_responses (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`).catch(err => {
  console.error("Error creating table:", err);
});

// Initialize Gemini client
const geminiAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = geminiAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 1024,
  }
});

// GET endpoint to fetch previous conversations
app.get("/api/conversations", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT question, answer, created_at 
       FROM tax_responses 
       ORDER BY created_at DESC 
       LIMIT 50`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Error fetching previous conversations." });
  }
});

// POST endpoint for handling tax-related questions
app.post("/api/askTax", async (req, res) => {
  try {
    const userQuestion = req.body.question;

    // System prompt to enforce tax-only queries
    const systemPrompt = `
      You are a specialized AI assistant with expertise in U.S. Tax law.
      You can only answer questions related to U.S. federal, state, or local tax matters.
      If the user asks any non-tax-related question, politely decline and remind them that
      this system is only for tax-related queries.

      User Question: ${userQuestion}
    `;

    // Generate content using Gemini
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const geminiAnswer = response.text();

    // Store the question and answer in PostgreSQL
    await pool.query(
      `INSERT INTO tax_responses (question, answer) VALUES ($1, $2)`,
      [userQuestion, geminiAnswer]
    );

    // Return the Gemini answer to the client
    res.json({ answer: geminiAnswer });
  } catch (error) {
    console.error(
      "Error in /api/askTax route:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Error processing your request." });
  }
});

app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
