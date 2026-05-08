// ---------- Load posts on index.html ----------
function loadPostsToHome() {
    const container = document.getElementById('postsContainer');
    if (!container) return;

    const posts = JSON.parse(localStorage.getItem('travelPosts')) || [];

    if (posts.length === 0) {
        container.innerHTML = '<div class="empty-posts">no posts yet. Go to Profile and share your experience!</div>';
        return;
    }

    container.innerHTML = '';
    posts.forEach((post, index) => {
        container.innerHTML += `
        <div class="post" data-index="${index}">
            <div class="post-info">
                <div class="post-title">${post.title}</div>
                <p>${post.content.substring(0, 100)}${post.content.length > 100 ? '…' : ''}</p>
                <small>by ${post.author}</small>
            </div>
        </div>`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('postsContainer')) {
        loadPostsToHome();
    }
});
