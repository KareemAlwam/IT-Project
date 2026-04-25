// ---------- Helper functions ----------
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

function setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
}

function logout() {
    localStorage.removeItem('currentUser');
    updateNavbar();
    window.location.href = 'index.html';
}

function updateNavbar() {
    const user = getCurrentUser();
    const loginLink = document.getElementById('loginNavLink') || document.getElementById('profileLoginLink');
    if (!loginLink) return;

    if (user) {
        loginLink.textContent = user;
        loginLink.href = '#';
        loginLink.onclick = () => logout();
    } else {
        loginLink.textContent = 'Login';
        loginLink.href = 'login.html';
        loginLink.onclick = null;
    }
}

// ---------- Load posts on index.html ----------
function loadPostsToHome() {
    const container = document.getElementById('postsContainer');
    if (!container) return;

    const posts = JSON.parse(localStorage.getItem('travelPosts')) || [];

    if (posts.length === 0) {
        container.innerHTML = '<div class="empty-posts">no posts yet. Go to Profile and share your experience!</div>';
        return;
    }

    container.innerHTML = ''; // clear first

    posts.forEach((post, index) => {
        container.innerHTML += `
        <div class="post-item" data-index="${index}">
            <div class="post-details">
                <div class="post-title">${post.title}</div>
                <p>${post.content.substring(0, 100)}${post.content.length > 100 ? '…' : ''}</p>
                <small>by ${post.author}</small>
            </div>
        </div>`;
    });
}
//===============================================================
// ---------- Profile page logic ----------
//===============================================================
function loadMyPosts() {
    const container = document.getElementById('myPostsList');
    if (!container) return;

    const currentUser = getCurrentUser();
    const allPosts = JSON.parse(localStorage.getItem('travelPosts')) || [];

    const myPosts = allPosts.filter(p => p.author === currentUser);

    if (myPosts.length === 0) {
        container.innerHTML = '<p class="empty-posts">you haven\'t posted anything yet.</p>';
        return;
    }

    container.innerHTML = '';

    allPosts.forEach((post, index) => {
        if (post.author !== currentUser) return;

        container.innerHTML += `
        <div class="post-item">
            <div class="post-details">
                <div class="post-title">${post.title}</div>
                <p>
                    ${post.content.substring(0, 100)}
                    ${post.content.length > 100 ? '…' : ''}
                </p>
            </div>
            <button class="delete-btn" onclick="deletePost(${index})">Delete</button>
        </div>`;
    });
}

function deletePost(index) {
    let allPosts = JSON.parse(localStorage.getItem('travelPosts')) || [];

    if (index >= 0 && index < allPosts.length) {
        allPosts.splice(index, 1);
        localStorage.setItem('travelPosts', JSON.stringify(allPosts));

        loadMyPosts();
    }
}

function addNewPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const errorDiv = document.getElementById('formError');
    
    if (title === "") {
        errorDiv.textContent = "Title is required.";
        return false;
    }
    if (content === "") {
        errorDiv.textContent = "Please write some content.";
        return false;
    }
    if (content.length < 5) {
        errorDiv.textContent = "Content must be at least 5 characters.";
        return false;
    }
    errorDiv.textContent = "";

    if (!getCurrentUser()) {
        alert("Please login first.");
        window.location.href = "login.html";
        return false;
    }
    
    const newPost = {
        title: title,
        content: content,
        author: getCurrentUser(),
        createdAt: new Date().toISOString()
    };
    
    let allPosts = JSON.parse(localStorage.getItem('travelPosts')) || [];
    allPosts.push(newPost);
    localStorage.setItem('travelPosts', JSON.stringify(allPosts));
    
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    
    loadMyPosts();
    alert("Post published!");
    return true;
}
//===============================================================
//       ---------- Login & Register logic ----------
//===============================================================

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const errorDiv = document.getElementById('loginError');
    
    if (!username || !password) {
        errorDiv.textContent = "Both fields are required.";
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        errorDiv.textContent = "Invalid username or password.";
        return;
    }
    
    setCurrentUser(username);
    window.location.href = "index.html";
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const confirm = document.getElementById('regConfirmPassword').value.trim();
    const errorDiv = document.getElementById('regError');
    
    if (!username || !email || !password || !confirm) {
        errorDiv.textContent = "All fields are required.";
        return;
    }
    if (password !== confirm) {
        errorDiv.textContent = "Passwords do not match.";
        return;
    }
    if (password.length < 4) {
        errorDiv.textContent = "Password must be at least 4 characters.";
        return;
    }
    if (!email.includes('@')) {
        errorDiv.textContent = "Enter a valid email address.";
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.username === username)) {
        errorDiv.textContent = "Username already exists.";
        return;
    }
    
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    setCurrentUser(username);
    window.location.href = "index.html";
}

// ---------- Initialize page-specific logic ----------
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();

    // index page
    if (document.getElementById('postsContainer')) {
        loadPostsToHome();
    }

    // profile page
    if (document.getElementById('addPostBtn')) {
        if (!getCurrentUser()) {
            window.location.href = "login.html";
        }
        loadMyPosts();
        document.getElementById('addPostBtn').addEventListener('click', addNewPost);
    }

    // login page
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }

    // register page
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
    }
});

