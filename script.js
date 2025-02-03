let md = window.markdownit();
let postsDirectory = 'posts';
let postsIndex = [
    {
        filename: 'first-post.md',
        title: 'My First Post',
        subtitle: 'abced',
        date: '2025-02-03',
    },
    {
        filename: 'other-post.md',
        title: 'Other Post',
        subtitle: 'testing',
        date: '2025-02-03',
    },
    // Add more posts here
];

async function loadMarkdownFile(filename) {
    try {
        let response = await fetch(filename);
        let text = await response.text();
        return md.render(text);
    } catch (error) {
        console.error('Error loading markdown file:', error);
        return '<p>Error loading content.</p>';
    }
}

function generatePostUrl(filename) {
    // Remove .md extension and convert to URL-friendly format
    return `?post=${filename.replace('.md', '')}`;
}

function getPostFilenameFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const postParam = urlParams.get('post');
    return postParam ? `${postParam}.md` : null;
}

async function loadPosts() {
    let content = document.getElementById('content');
    let html = '<h2>Blog Posts</h2>';
    
    for (let post of postsIndex) {
        html += `
            <div class="post-preview">
                <h3 class="post-title">
                    <a href="${generatePostUrl(post.filename)}">${post.title}</a>
                </h3>
                <h5>${post.date}</h5>
                <p>${post.subtitle}</p>
            </div>
        `;
    }
    
    content.innerHTML = html;
    // Update the page title
    document.title = 'Blog Posts';
}

async function loadPost(filename) {
    let content = document.getElementById('content');
    let post = postsIndex.find(p => p.filename === filename);
    
    if (!post) {
        content.innerHTML = '<p>Post not found.</p>';
        return;
    }

    let postContent = await loadMarkdownFile(`${postsDirectory}/${filename}`);
    content.innerHTML = `
        <article>
            <h2>${post.title}</h2>
            <div class="post-date">${post.date}</div>
            <div class="post-content">${postContent}</div>
        </article>
    `;
    // Update the page title
    document.title = post.title;
}

async function loadAbout() {
    let content = document.getElementById('content');
    let aboutContent = await loadMarkdownFile('about.md');
    content.innerHTML = aboutContent;
    // Update the page title
    document.title = 'About';
}

// Router function to handle different pages
async function handleRoute() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    const postFilename = getPostFilenameFromUrl();

    if (postFilename) {
        await loadPost(postFilename);
    } else if (page === 'about') {
        await loadAbout();
    } else {
        await loadPosts();
    }
}

// Initialize the page
handleRoute();

// Handle browser navigation events
window.addEventListener('popstate', handleRoute);
