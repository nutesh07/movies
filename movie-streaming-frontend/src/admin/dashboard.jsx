console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);


import { useEffect, useState } from "react";
import axios from "axios";
import {
  CardContent,
  Typography,
  Grid,
  Card,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Table,
  TableCell,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const chartData =
    stats && stats.topMovies
      ? stats.topMovies.map((movie) => ({
          movie: movie.title,
          views: movie.views,
        }))
      : [];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/dashboard`

        );
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Typography variant="h6" align="center" sx={{ my: 4 }}>
        Loading dashboard data...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
        {error}
      </Typography>
    );
  }

  if (!stats) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
        No data available
      </Typography>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f5f6fa 0%, #e3eafc 100%)",
        boxSizing: "border-box",
        padding: "2rem",
        width: "100%",
        overflowX: "hidden",
        maxWidth: "1300px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
         Movie Stream Admin Dashboard
      </Typography>

      {/* Statistic Cards */}
      <Grid container spacing={3} alignItems="center" style={{ marginTop: "2rem" }}>
        <StatCard title="Total Users" value={stats.totalUsers} description="Registered Users" />
        <StatCard title="Movies Uploaded" value={stats.totalMovies} description="Available Movies" />
        <StatCard title="Total Views" value={stats.totalViews} description="All Movie Views" />
        <StatCard title="Active Users" value={stats.activeUsers} description="Users Active This Week" />
      </Grid>

      {/* Charts and Recent Views */}
      <Grid container spacing={3} alignItems="stretch" style={{ marginTop: "2rem" }}>
        {/* Most Watched Movies */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "1.5rem", borderRadius: "16px" }}>
            <Typography variant="h6" gutterBottom>
              Most Watched Movies
            </Typography>
            <BarChart
              xAxis={[
                {
                  dataKey: "movie",
                  label: "Movie",
                  tickLabelStyle: { fontSize: 12 },
                },
              ]}
              series={[{ dataKey: "views", label: "Views", color: "#1976d2" }]}
              dataset={chartData}
              height={350}
            />
          </Paper>
        </Grid>

        {/* Recently Viewed Users */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "1rem", borderRadius: "16px" }}>
            <Typography variant="h6" gutterBottom>
              Recently Viewed Users
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Email</TableCell>
                  <TableCell>Movie</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.recentlyViewed.length > 0 ? (
                  stats.recentlyViewed.map((view, index) => (
                    <TableRow key={index}>
                      <TableCell>{view.email}</TableCell>
                      <TableCell>{view.movieTitle}</TableCell>
                      <TableCell>{new Date(view.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No Recent Views
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

function StatCard({ title, value, description }) {
  return (
    <Grid item xs={12} md={3}>
      <Card
        sx={{
          borderLeft: "6px solid #1976d2",
          background: "#fff",
          boxShadow: "0 2px 12px rgba(25, 118, 210, 0.08)",
          borderRadius: "16px",
          marginBottom: "1rem",
        }}
      >
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ color: "#1976d2", fontWeight: 700 }}>
            {value}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {description}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}
