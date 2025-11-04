import { db } from "../../config/db.js";

// ------------------- ADMIN DASHBOARD -------------------
export const dashboard = async (req, res) => {
  try {
    //  Total Users
    const [userCountRow] = await new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    const totalUsers = userCountRow.totalUsers;

    // Total Movies
    const [movieCountRow] = await new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS totalMovies FROM movies", (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    const totalMovies = movieCountRow.totalMovies;

    //  Recently Added Movies (5 latest by created_at)
    const recentMovies = await new Promise((resolve, reject) => {
      db.query(
        `
        SELECT m.id, m.title, m.poster_url, m.trailer_url, m.release_date, m.created_at, 
               u.name AS creator_name, u.email AS creator_email
        FROM movies m
        JOIN users u ON m.created_by = u.id
        ORDER BY m.created_at DESC
        LIMIT 5
        `,
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    //  Top 5 Creators (by total movies)
    const topCreators = await new Promise((resolve, reject) => {
      db.query(
        `
        SELECT u.id AS creator_id, u.name AS creator_name, COUNT(m.id) AS totalCreated
        FROM movies m
        JOIN users u ON m.created_by = u.id
        GROUP BY u.id
        ORDER BY totalCreated DESC
        LIMIT 5
        `,
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalMovies,
        recentMovies,
        topCreators,
      },
    });
  } catch (error) {
    console.error(" Dashboard Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error while fetching dashboard data",
      error: error.message,
    });
  }
};
