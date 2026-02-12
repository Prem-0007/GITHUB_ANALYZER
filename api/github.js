import fetch from "node-fetch";

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) return res.status(400).json({ error: "Username is required" });

  const token = process.env.GITHUB_TOKEN;

  console.log("Fetching GitHub API for", username);

  try {
    const profileRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "GitHubAnalyzer",
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    const profile = await profileRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "GitHubAnalyzer",
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    const repos = await reposRes.json();

    return res.status(200).json({ profile, repos });
  } catch {
    return res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
}