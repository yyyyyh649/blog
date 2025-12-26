/**
 * 博客构建脚本
 * 
 * 功能：
 * 1. 解析 markdown 文件夹中的 .md 文件
 * 2. 将 markdown 转换为 HTML
 * 3. 生成文章页面
 * 4. 更新首页和文章列表页
 * 
 * 使用方法：node scripts/build.js
 */

const fs = require('fs');
const path = require('path');

// 路径配置
const MARKDOWN_DIR = path.join(__dirname, '..', 'markdown');
const POSTS_DIR = path.join(__dirname, '..', 'posts');
const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const POSTS_HTML_PATH = path.join(__dirname, '..', 'posts.html');

/**
 * 解析 Markdown 文件的 frontmatter
 * @param {string} content - 文件内容
 * @returns {Object} - { frontmatter, body }
 */
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { frontmatter: {}, body: content };
    }
    
    const frontmatterStr = match[1];
    const body = match[2];
    
    const frontmatter = {};
    frontmatterStr.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            
            // 移除引号
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            // 处理布尔值
            if (value === 'true') value = true;
            if (value === 'false') value = false;
            
            frontmatter[key] = value;
        }
    });
    
    return { frontmatter, body };
}

/**
 * 将 Markdown 转换为 HTML
 * @param {string} markdown - Markdown 内容
 * @returns {string} - HTML 内容
 */
function markdownToHtml(markdown) {
    let html = markdown;
    
    // 处理标题 (h1 - h6)
    html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // 处理引用块
    html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');
    
    // 处理粗体和斜体
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    
    // 处理行内代码
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // 处理链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // 处理图片
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    
    // 处理无序列表
    html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
    
    // 处理有序列表
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    
    // 将连续的 <li> 包装在 <ul> 中
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
        return '<ul>\n' + match + '</ul>\n';
    });
    
    // 处理水平线
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^\*\*\*$/gm, '<hr>');
    
    // 处理段落（非空行且不是已处理的标签）
    const lines = html.split('\n');
    const processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === '') {
            processedLines.push('');
            continue;
        }
        
        // 检查是否已经是 HTML 标签
        if (line.startsWith('<h') || 
            line.startsWith('<blockquote') || 
            line.startsWith('<ul') || 
            line.startsWith('</ul') ||
            line.startsWith('<li') ||
            line.startsWith('<hr') ||
            line.startsWith('<img') ||
            line.startsWith('<p')) {
            processedLines.push(line);
        } else {
            processedLines.push('<p>' + line + '</p>');
        }
    }
    
    html = processedLines.join('\n');
    
    // 清理空的段落
    html = html.replace(/<p><\/p>/g, '');
    
    // 合并连续的空行
    html = html.replace(/\n{3,}/g, '\n\n');
    
    return html.trim();
}

/**
 * 格式化日期为中文格式
 * @param {string} dateStr - 日期字符串 (YYYY-MM-DD)
 * @returns {string} - 中文格式日期
 */
function formatDateChinese(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return dateStr;
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

/**
 * 生成文章 HTML 页面
 * @param {Object} post - 文章数据
 * @returns {string} - HTML 内容
 */
function generatePostHtml(post) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} | 随想录</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body>
    <header class="site-header">
        <nav class="nav-container" role="navigation" aria-label="主导航">
            <a href="../index.html" class="logo">随想录</a>
            <ul class="nav-links">
                <li><a href="../index.html">首页</a></li>
                <li><a href="../posts.html">文章</a></li>
                <li><a href="../about.html">关于我</a></li>
            </ul>
        </nav>
    </header>

    <main class="main-content">
        <article class="article-container">
            <header class="article-header">
                <p class="article-category">${post.category}</p>
                <h1 class="article-title">${post.title}</h1>
                <p class="article-date">${formatDateChinese(post.date)}</p>
            </header>

            <div class="article-content">
                ${post.htmlContent}
            </div>

            <footer class="article-footer">
                <a href="../posts.html" class="back-link">← 返回文章列表</a>
            </footer>
        </article>
    </main>

    <footer class="site-footer">
        <div class="footer-content">
            <p>© 2024 随想录 | 用心记录每一刻</p>
        </div>
    </footer>
</body>
</html>`;
}

/**
 * 生成首页的文章卡片 HTML
 * @param {Object} post - 文章数据
 * @returns {string} - HTML 内容
 */
function generatePostCard(post) {
    const pinnedBadge = post.pinned ? '<span class="post-pinned">📌 置顶</span>' : '';
    return `                <article class="post-card${post.pinned ? ' pinned' : ''}">
                    <div class="post-meta">
                        <span class="post-date">${formatDateChinese(post.date)}</span>
                        <span class="post-category">${post.category}</span>
                        ${pinnedBadge}
                    </div>
                    <h3 class="post-title">
                        <a href="posts/${post.slug}.html">${post.title}</a>
                    </h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                </article>`;
}

/**
 * 生成文章列表页的文章项 HTML
 * @param {Object} post - 文章数据
 * @returns {string} - HTML 内容
 */
function generatePostListItem(post) {
    const pinnedBadge = post.pinned ? '<span class="post-pinned">📌 置顶</span>' : '';
    return `            <article class="post-list-item${post.pinned ? ' pinned' : ''}">
                <div class="post-meta">
                    <span class="post-date">${formatDateChinese(post.date)}</span>
                    <span class="post-category">${post.category}</span>
                    ${pinnedBadge}
                </div>
                <h2 class="post-list-title">
                    <a href="posts/${post.slug}.html">${post.title}</a>
                </h2>
                <p class="post-excerpt">${post.excerpt}</p>
            </article>`;
}

/**
 * 更新首页 HTML
 * @param {Array} posts - 文章列表
 */
function updateIndexHtml(posts) {
    const indexTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的随想录 | 个人博客</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body>
    <header class="site-header">
        <nav class="nav-container" role="navigation" aria-label="主导航">
            <a href="index.html" class="logo">随想录</a>
            <ul class="nav-links">
                <li><a href="index.html" class="active" aria-current="page">首页</a></li>
                <li><a href="posts.html">文章</a></li>
                <li><a href="about.html">关于我</a></li>
            </ul>
        </nav>
    </header>

    <main class="main-content">
        <section class="hero">
            <div class="hero-content">
                <h1 class="hero-title">记录生活的点滴</h1>
                <p class="hero-subtitle">人生感悟 · 计划日记 · 随想杂记</p>
            </div>
        </section>

        <section class="featured-posts">
            <h2 class="section-title">最新文章</h2>
            <div class="posts-grid">
${posts.slice(0, 6).map(post => generatePostCard(post)).join('\n\n')}
            </div>
            <div class="view-all">
                <a href="posts.html" class="view-all-link">查看全部文章 →</a>
            </div>
        </section>

        <section class="quote-section">
            <blockquote class="featured-quote">
                <p>"生活不是等待暴风雨过去，而是学会在雨中起舞。"</p>
            </blockquote>
        </section>
    </main>

    <footer class="site-footer">
        <div class="footer-content">
            <p>© 2024 随想录 | 用心记录每一刻</p>
        </div>
    </footer>
</body>
</html>`;

    fs.writeFileSync(INDEX_PATH, indexTemplate, 'utf-8');
    console.log('✅ 已更新 index.html');
}

/**
 * 更新文章列表页 HTML
 * @param {Array} posts - 文章列表
 */
function updatePostsHtml(posts) {
    const postsTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>全部文章 | 随想录</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body>
    <header class="site-header">
        <nav class="nav-container" role="navigation" aria-label="主导航">
            <a href="index.html" class="logo">随想录</a>
            <ul class="nav-links">
                <li><a href="index.html">首页</a></li>
                <li><a href="posts.html" class="active" aria-current="page">文章</a></li>
                <li><a href="about.html">关于我</a></li>
            </ul>
        </nav>
    </header>

    <main class="main-content">
        <section class="page-header">
            <h1 class="page-title">全部文章</h1>
            <p class="page-description">记录生活，沉淀思考</p>
        </section>

        <section class="posts-list">
${posts.map(post => generatePostListItem(post)).join('\n\n')}
        </section>
    </main>

    <footer class="site-footer">
        <div class="footer-content">
            <p>© 2024 随想录 | 用心记录每一刻</p>
        </div>
    </footer>
</body>
</html>`;

    fs.writeFileSync(POSTS_HTML_PATH, postsTemplate, 'utf-8');
    console.log('✅ 已更新 posts.html');
}

/**
 * 主函数
 */
function main() {
    console.log('🚀 开始构建博客...\n');
    
    // 确保 markdown 目录存在
    if (!fs.existsSync(MARKDOWN_DIR)) {
        fs.mkdirSync(MARKDOWN_DIR, { recursive: true });
        console.log('📁 已创建 markdown 目录');
    }
    
    // 读取所有 markdown 文件
    const files = fs.readdirSync(MARKDOWN_DIR).filter(file => file.endsWith('.md'));
    
    if (files.length === 0) {
        console.log('⚠️  markdown 目录中没有找到 .md 文件');
        console.log('   请在 markdown/ 目录中添加 Markdown 文件');
        return;
    }
    
    console.log(`📝 找到 ${files.length} 个 Markdown 文件\n`);
    
    const posts = [];
    
    // 处理每个 markdown 文件
    files.forEach(file => {
        const filePath = path.join(MARKDOWN_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { frontmatter, body } = parseFrontmatter(content);
        
        // 验证必要的 frontmatter 字段
        if (!frontmatter.title) {
            console.warn(`⚠️  跳过 ${file}: 缺少 title 字段`);
            return;
        }
        if (!frontmatter.date) {
            console.warn(`⚠️  跳过 ${file}: 缺少 date 字段`);
            return;
        }
        
        // 生成 slug（用于文件名）
        const slug = file.replace('.md', '');
        
        // 转换 markdown 为 HTML
        const htmlContent = markdownToHtml(body);
        
        const post = {
            title: frontmatter.title,
            date: frontmatter.date,
            category: frontmatter.category || '随想杂记',
            excerpt: frontmatter.excerpt || body.slice(0, 100).replace(/[#*_`\[\]]/g, '').trim() + '...',
            pinned: frontmatter.pinned === true || frontmatter.pinned === 'true',
            slug: slug,
            htmlContent: htmlContent
        };
        
        posts.push(post);
        
        // 生成文章 HTML 文件
        const postHtml = generatePostHtml(post);
        const postPath = path.join(POSTS_DIR, `${slug}.html`);
        fs.writeFileSync(postPath, postHtml, 'utf-8');
        console.log(`📄 已生成: posts/${slug}.html`);
    });
    
    if (posts.length === 0) {
        console.log('\n⚠️  没有有效的文章可以处理');
        return;
    }
    
    // 排序：置顶文章在前，然后按日期降序排序
    posts.sort((a, b) => {
        // 置顶文章优先
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        
        // 按日期降序排序
        return new Date(b.date) - new Date(a.date);
    });
    
    console.log('\n📊 文章排序完成（置顶优先，按日期降序）\n');
    
    // 更新首页和文章列表页
    updateIndexHtml(posts);
    updatePostsHtml(posts);
    
    console.log(`\n✨ 构建完成！共处理 ${posts.length} 篇文章`);
}

// 运行主函数
main();
