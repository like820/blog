
        let md = window.markdownit();
        let postsDirectory = 'posts';
        let postsIndex = [
            { 
                filename: 'first-post.md',
                title: 'My First Post',
                subtitle: 'abced',
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

        async function loadPosts() {
            let content = document.getElementById('content');
            let html = '<h2>Blog Posts</h2>';
            
            for (let post of postsIndex) {
                html += `
               
                        <h3 class="post-title">
                            <a href="#" onclick="loadPost('${post.filename}')">${post.title}</a>
                        <h5>${post.date}</h5>
                        <p>${post.subtitle}</p>
          
                        
                    </li>
                `;
            }
            
            content.innerHTML = html;
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
        }

        async function loadAbout() {
            let content = document.getElementById('content');
            let aboutContent = await loadMarkdownFile('about.md');
            content.innerHTML = aboutContent;
        }

        // Load the posts list by default
        loadPosts();
