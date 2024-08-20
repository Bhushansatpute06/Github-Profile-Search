// The base URL for GitHub's API to get user information
let api = "https://api.github.com/users/";

// Create a new script element to load Axios library
let fetch = document.createElement("script");

// Set the source of the script to the CDN link of Axios
fetch.src = `https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js`;

// Integrity and cross-origin settings for security
fetch.integrity = `ha512-DZqqY3PiOvTP9HkjIWgjO6ouCbq+dxqWoJZ/Q+zPYNHmlnI2dQnbJ5bxAHpAMw+LXRm4D72EIRXzvcHQtE8/VQ==`;
fetch.crossOrigin = "anonymous";

// Append the script to the document's head to load Axios
document.head.appendChild(fetch);

// Get references to the main content area and the input form elements
let main = document.getElementById("main");
let inputForm = document.getElementById("userInput");
let inputBox = document.getElementById("inputBox");

// Function to get user data from GitHub API based on the username
const userGetFunction = (name) => {
    axios(api + name) // Make a GET request to GitHub API
        .then((response) => {
            // If successful, display user info and fetch their repos
            userCard(response.data);
            repoGetFunction(name);
        })
        .catch((err) => {
            // If there's an error (like 404 - Not Found), show an error message
            if (err.response.status == 404) {
                errorFunction("No profile with this username");
            }
        });
};

// Function to get the user's repositories from GitHub API
const repoGetFunction = (name) => {
    axios(api + name + "/repos?sort=created") // Make a GET request for the repos
        .then((response) => {
            // If successful, display the repos
            repoCardFunction(response.data);
        })
        .catch((err) => {
            // If there's an error fetching repos, show an error message
            errorFunction("Problem fetching repos");
        });
};

// Function to create and display a user card with their info
const userCard = (user) => {
    // Use name if available, otherwise use the login as the user's ID
    let id = user.name || user.login;
    // Check if the user has a bio and create a paragraph for it
    let info = user.bio ? `<p>${user.bio}</p>` : "";

    // Create the HTML structure for the user card
    let cardElement = `
<div class="card">
    <div>
        <img src="${user.avatar_url}" 
             alt="${user.name}" 
             class="avatar">
    </div>
    <div class="user-info">
        <h2>${id}</h2>
        ${info}
        <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
        </ul>
        <div id="repos"></div>
    </div>
</div>`;

    // Insert the user card into the main content area
    main.innerHTML = cardElement;
};

// Function to display an error message if something goes wrong
const errorFunction = (error) => {
    // Create the HTML structure for the error message
    let cardHTML = `
<div class="card">
    <h1>${error}</h1>
</div>`;

    // Insert the error message into the main content area
    main.innerHTML = cardHTML;
};

// Function to create and display links to the user's repositories
const repoCardFunction = (repos) => {
    // Get the element where the repos will be displayed
    let reposElement = document.getElementById("repos");

    // Loop through up to 5 repositories and create links for them
    for (let i = 0; i < 5 && i < repos.length; i++) {
        let repo = repos[i];
        let repoEl = document.createElement("a");

        // Set attributes for the repo link
        repoEl.classList.add("repo");
        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        repoEl.innerText = repo.name;

        // Add the repo link to the repos element
        reposElement.appendChild(repoEl);
    }
};

// Event listener for form submission to trigger user search
inputForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    // Get the input value (username) from the input box
    let user = inputBox.value;

    // If there's a username, fetch the user data
    if (user) {
        userGetFunction(user);
        inputBox.value = ""; // Clear the input box after searching
    }
});
