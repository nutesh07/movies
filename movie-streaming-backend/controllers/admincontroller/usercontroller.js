import { db } from "../../config/db.js";

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
