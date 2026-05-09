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
        showNotification("Please login first.", "error");
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
    showNotification("Post published!", "success");
    return true;
}

// Real profile page (profile.html): show username, email, post count.
function loadProfile() {
    const username = getCurrentUser();
    if (!username) { window.location.href = "login.html"; return; }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username) || {};
    const posts = JSON.parse(localStorage.getItem('travelPosts')) || [];

    let count = 0;
    posts.forEach(p => { if (p.author === username) count++; });

    document.getElementById('profileUsername').textContent = username;
    document.getElementById('profileEmail').textContent = user.email || '-';
    document.getElementById('profilePostCount').textContent = count;
}

document.addEventListener('DOMContentLoaded', () => {
    // Posts page (posts.html): publish + list user's posts.
    if (document.getElementById('addPostBtn')) {
        if (!getCurrentUser()) {
            window.location.href = "login.html";
        }
        loadMyPosts();
        document.getElementById('addPostBtn').addEventListener('click', addNewPost);
    }

    // Profile page (profile.html): show profile info.
    if (document.getElementById('profileUsername')) {
        loadProfile();
    }
});
