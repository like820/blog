let md = window.markdownit();
let postsDirectory = 'posts';
let postsIndex = [
    {
        filename: 'first-post.md',
        title: 'My First Post',
        subtitle: 'abced',
        date: '2025-02-03',
        miniature: '🚀', // Using emoji
    },
    {
        filename: 'other-post.md',
        title: 'Other Post',
        subtitle: 'testing',
        date: '2025-02-03',
        miniature: 'images/post-thumbnail.jpg', // Using image path
    },
    {
        filename: 'third-post.md',
        title: 'Third Post',
        subtitle: 'Another test',
        date: '2025-02-03',
        miniature: '📝', // Using emoji
    },
    {
        filename: 'flowNote1.md',
        title: 'attractive reaseach',
        subtitle: 'Another test',
        date: '2025-02-05',
        miniature: '🗑️', // Using emoji
    }
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
    return `?post=${filename.replace('.md', '')}`;
}

function getPostFilenameFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const postParam = urlParams.get('post');
    return postParam ? `${postParam}.md` : null;
}

function renderMiniature(miniature) {
    // Check if the miniature is an emoji (simple check for now)
    const isEmoji = miniature && miniature.length <= 2;
    
    if (!miniature) {
        return '📄'; // Default emoji for posts without miniature
    } else if (isEmoji) {
        return miniature;
    } else {
        return `<img src="${miniature}" alt="Post thumbnail" class="post-miniature">`;
    }
}

async function loadPosts() {
    let content = document.getElementById('content');
    let html = '<h2>Blog Posts</h2>';
    
    for (let post of postsIndex) {
        html += `
            <div class="post-preview">
                <div class="post-header">
                 <h3 class="post-title">
                            <a href="${generatePostUrl(post.filename)}">${post.title}</a>
                        </h3>
                    <div class="miniature">
                        ${renderMiniature(post.miniature)}
                    </div>
                    <div class="post-info">
                       
                        <h5>${post.date}</h5>
                        <p>${post.subtitle}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    content.innerHTML = html;
    document.title = 'drops post or sth💧';
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
            <div class="post-header">
                <div class="miniature large">
                    ${renderMiniature(post.miniature)}
                </div>
                <div class="post-info">
                    <h2>${post.title}</h2>
                    <div class="post-date">${post.date}</div>
                </div>
            </div>
            <div class="post-content">${postContent}</div>
        </article>
    `;
    document.title = post.title;
}

async function loadAbout() {
    let content = document.getElementById('content');
    let aboutContent = await loadMarkdownFile('about.md');
    content.innerHTML = aboutContent;
    document.title = 'About';
}

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



//dark theme
let themeSwitcher = document.getElementById("theme-switcher");
themeSwitcher.addEventListener("change", function() {
  if (this.checked) {
    document.documentElement.classList.add("dark-theme");
  } else {
    document.documentElement.classList.remove("dark-theme");
  }
});        