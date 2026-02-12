const themeBtn = document.getElementById("themeBtn");

window.onload = function () {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
  }
};

function toggleDarkMode() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeBtn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
}

async function getProfile() {
  const username = document.getElementById("username").value.trim();
  const profileDiv = document.getElementById("profile");
  const reposDiv = document.getElementById("repos");

  profileDiv.innerHTML = "";
  reposDiv.innerHTML = "";

  if (!username) {
    showError("Please enter a GitHub username.");
    return;
  }

  try {
    showLoading();

    const res = await fetch(`/api/github/${username}`);
    const data = await res.json();

    if (!res.ok) {
      showError(data.error || "Something went wrong");
      return;
    }

    displayProfile(data.profile);
    displayRepos(data.repos);

  } catch (error) {
    showError("Network error.");
  }
}

function displayProfile(user) {
  document.getElementById("profile").innerHTML = `
    <div class="profile-card">
      <img src="${user.avatar_url}" width="120" style="border-radius:50%">
      <h2>${user.name || user.login}</h2>
      <p>${user.bio || "No bio available"}</p>
      <p>Followers: ${user.followers}</p>
      <p>Following: ${user.following}</p>
      <p>Public Repos: ${user.public_repos}</p>
    </div>
  `;
}

function displayRepos(repos) {
  const reposDiv = document.getElementById("repos");

  repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .forEach(repo => {
      reposDiv.innerHTML += `
        <div class="repo-card">
          <h3>${repo.name}</h3>
          <p>${repo.description || "No description"}</p>
          ⭐ ${repo.stargazers_count} | ${repo.language || "No language"} <br>
          <a href="${repo.html_url}" target="_blank">View Repository</a>
        </div>
      `;
    });
}

function showError(message) {
  document.getElementById("profile").innerHTML = `
    <div class="profile-card error">
      ${message}
    </div>
  `;
}

function showLoading() {
  document.getElementById("profile").innerHTML = `
    <div class="profile-card">
      Loading...
    </div>
  `;
}