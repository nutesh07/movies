import bcrypt from "bcrypt";
import { db } from "../../config/db.js";

// ---------------- CREATE USER (Admin Only) ----------------
export const createUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const [existing] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db
      .promise()
      .query(
        "INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)",
        [fullName, email, hashedPassword, role || "user"]
      );

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
};

// ---------------- FETCH ALL USERS ----------------
export const getAllUsers = (req, res) => {
  const query = "SELECT id, fullname AS name, email, role FROM users";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({
      success: true,
      count: results.length,
      users: results,
    });
  });
};

// ---------------- DELETE USER ----------------
export const deleteUser = (req, res) => {
  const userId = req.params.id;

  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  });
};

// ---------------- EDIT USER ----------------
export const editUser = (req, res) => {
  const userId = req.params.id;
  const { fullname, email, role } = req.body;

  const query = "UPDATE users SET fullname = ?, email = ?, role = ? WHERE id = ?";
  db.query(query, [fullname, email, role, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  });
};


