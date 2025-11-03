import express from "express";
import { dashboard } from "../controllers/admincontroller/dashboard.js";
import { verifyToken, checkAdmin } from "../middleware/authMiddleware.js"; 
import { createMovie, editMovie, deleteMovie } from "../controllers/admincontroller/moviescontroller.js";
import { getAllUsers, deleteUser, editUser } from "../controllers/admincontroller/usercontroller.js";

const router = express.Router();

// ---------------- ADMIN DASHBOARD ----------------
router.get("/dashboard", verifyToken, checkAdmin, dashboard);

// ---------------- MOVIE MANAGEMENT ----------------

router.post("/movies", verifyToken, checkAdmin, createMovie);
router.put("/movies/:id", verifyToken, checkAdmin, editMovie);
router.delete("/movies/:id", verifyToken, checkAdmin, deleteMovie);

// ---------------- USER MANAGEMENT ----------------
router.get("/users", verifyToken, checkAdmin, getAllUsers);
router.put("/users/:id", verifyToken, checkAdmin, editUser);
router.delete("/users/:id", verifyToken, checkAdmin, deleteUser);


export default router;
