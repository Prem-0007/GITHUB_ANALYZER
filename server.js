import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

if (!process.env.GITHUB_TOKEN) {
  console.error("❌ GITHUB_TOKEN missing in .env");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT || 8080;

app.get("/api/github/:username", async (req, res) => {
  const username = req.params.username;
  const token = process.env.GITHUB_TOKEN;

  try {
    const [profileRes, repoRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "GitHubAnalyzer"
        }
      }),
      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "GitHubAnalyzer"
        }
      })
    ]);

    if (profileRes.status === 404) {
      return res.status(404).json({ error: "User not found" });
    }

    const profileData = await profileRes.json();
    const repoData = await repoRes.json();

    res.json({
      profile: profileData,
      repos: repoData
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch GitHub data",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});