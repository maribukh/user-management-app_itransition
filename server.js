import express from "express";
import cors from "cors";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import "dotenv/config";

const { Pool } = pkg;
const app = express();

const SECRET_KEY = process.env.SECRET_KEY || "your_super_secret_key";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const DATABASE_URL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: FRONTEND_URL,
  })
);
app.use(express.json());

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.");
}
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER || "32716a422f78e3",
    pass: process.env.MAILTRAP_PASS || "5ed966fc266fa9",
  },
});

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
      decoded.id,
    ]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.status === "blocked") {
      return res.status(403).json({ message: "User is blocked" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the User Management API" });
});

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUserQuery = `
      INSERT INTO users (name, email, password_hash, verification_token) 
      VALUES ($1, $2, $3, $4) RETURNING id
    `;
    await pool.query(newUserQuery, [
      name,
      email,
      passwordHash,
      verificationToken,
    ]);

    const verificationLink = `${FRONTEND_URL}/verify-email/${verificationToken}`;

    await transporter.sendMail({
      from: '"Task 5 App" <no-reply@task5.com>',
      to: email,
      subject: "Please verify your email address",
      html: `<b>Please click the following link to verify your email:</b> <a href="${verificationLink}">${verificationLink}</a>`,
    });

    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const result = await pool.query(
      "SELECT * FROM users WHERE verification_token = $1",
      [token]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token." });
    }

    await pool.query(
      "UPDATE users SET status = 'active', verification_token = NULL WHERE id = $1",
      [user.id]
    );

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status === "unverified") {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    if (user.status === "blocked") {
      return res
        .status(403)
        .json({ message: "Your account has been blocked." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await pool.query("UPDATE users SET last_login_time = NOW() WHERE id = $1", [
      user.id,
    ]);

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, registration_time, last_login_time, status FROM users ORDER BY id ASC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/users/update-status", authenticateToken, async (req, res) => {
  const { userIds, status } = req.body;
  if (!userIds || !userIds.length || !status) {
    return res
      .status(400)
      .json({ message: "User IDs and status are required" });
  }

  try {
    const query = "UPDATE users SET status = $1 WHERE id = ANY($2::int[])";
    await pool.query(query, [status, userIds]);
    res.status(200).json({ message: "Users status updated successfully" });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/users/delete", authenticateToken, async (req, res) => {
  const { userIds } = req.body;
  if (!userIds || !userIds.length) {
    return res.status(400).json({ message: "User IDs are required" });
  }

  try {
    const query = "DELETE FROM users WHERE id = ANY($1::int[])";
    await pool.query(query, [userIds]);
    res.status(200).json({ message: "Users deleted successfully" });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post(
  "/api/users/delete-unverified",
  authenticateToken,
  async (req, res) => {
    try {
      const query = "DELETE FROM users WHERE status = 'unverified'";
      const result = await pool.query(query);
      res.status(200).json({
        message: `${result.rowCount} unverified users deleted successfully`,
      });
    } catch (error) {
      console.error("Error deleting unverified users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
