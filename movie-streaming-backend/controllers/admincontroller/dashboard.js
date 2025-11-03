import { db } from "../../config/db.js";

// Admin Dashboard Controller
export const dashboard = async (req, res) => {
  try {
    // Total users
    const [userCount] = await new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // Total movies
    const [movieCount] = await new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS totalMovies FROM movies", (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // Recent 5 movies (latest)
    const recentMovies = await new Promise((resolve, reject) => {
      db.query(
        "SELECT id, title, release_date, created_by FROM movies ORDER BY release_date DESC LIMIT 5",
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    // movies creted by Top 5 creators)
    const topCreators = await new Promise((resolve, reject) => {
      db.query(
        `SELECT created_by, COUNT(*) AS totalCreated 
         FROM movies 
         GROUP BY created_by 
         ORDER BY totalCreated DESC 
         LIMIT 5`,
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    
    res.status(200).json({
      success: true,
      data: {
        totalUsers: userCount.totalUsers,
        totalMovies: movieCount.totalMovies,
        recentMovies,
        topCreators,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error while fetching dashboard data",
      error: error.message,
    });
  }
};
