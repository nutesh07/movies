import { db } from "../config/db.js";

export const createMovieTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS movies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      poster_url VARCHAR(255),
      trailer_url VARCHAR(255),
      release_date DATE NOT NULL,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `;

  db.query(query, (error) => {
    if (error) console.log("❌ Error creating movies table:", error.message);
    else console.log("✅ Movies table created successfully");
  });
};
