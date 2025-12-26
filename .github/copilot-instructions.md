# 个人博客项目 - GitHub Copilot 指南

这是一个简约优雅的个人博客，用于记录人生感悟、未来计划和日常琐事。整体风格追求舒适、简洁、高级感。

## 项目目标

- **首页展示**：展示最新文章列表，带摘要和日期
- **文章页面**：支持 Markdown 写作，转为 HTML 显示
- **分类系统**：包括"人生感悟"、"年度计划"、"随想杂记"等分类
- **功能特性**：支持搜索、归档和 RSS 订阅
- **响应式设计**：确保手机/电脑都舒适浏览

## 技术栈

- **静态站点**：纯 HTML/CSS/JavaScript，无需后端
- **未来计划**：考虑迁移到 Hugo 或 Hexo 静态站点生成器
  - Hugo：速度快，构建迅速
  - Hexo：插件丰富，生态完善
- **主题风格**：简约高级风格
- **内容管理**：当前使用 HTML 文件，未来可迁移到 Markdown
- **部署方式**：GitHub Pages 或 Cloudflare Pages 自动构建
- **字体来源**：Google Fonts（Noto Serif SC + Inter）

## 风格规范

### 配色方案
- **主背景色**：`#f5f5f5`（浅灰色，柔和舒适）
- **主文字色**：`#333333`（深灰色，易读）
- **强调色**：`#4a90e2`（蓝色，用于链接和按钮）
- **次要色**：`#666666`（中灰色，用于次要文字）
- **卡片背景**：`#ffffff`（纯白色）
- **分类标签**：
  - 人生感悟：`#e8f4f8`（淡蓝色）
  - 年度计划：`#fff3e0`（淡橙色）
  - 随想杂记：`#f3e5f5`（淡紫色）

### 字体规范
- **中文标题**：'Noto Serif SC'（优雅宋体，font-weight: 600）
- **中文正文**：'Noto Serif SC'（font-weight: 400）
- **英文/数字**：'Inter'（现代无衬线字体）
- **后备字体**：sans-serif
- **字体大小**：
  - 主标题：2-3rem
  - 副标题：1.5-2rem
  - 正文：1rem (16px)
  - 小字：0.875rem

### 布局规范
- **间距**：宽松舒适，padding 至少 20px
- **文章预览**：卡片式设计，带淡入动画
- **最大宽度**：1200px（内容区域）
- **栅格布局**：响应式网格，移动端单列，桌面端多列
- **圆角**：8-12px（卡片和按钮）
- **阴影**：subtle box-shadow，hover 时加深
- **动画**：平滑过渡（transition: 0.3s ease）

### 高级感设计原则
- **微互动**：hover 阴影、平滑滚动、淡入效果
- **留白**：充足的空间，不拥挤
- **简约**：每页主要元素不超过 10 个块
- **优雅**：柔和的颜色过渡，优雅的字体
- **克制**：避免过多图片、广告、复杂导航
- **聚焦内容**：优先文字内容，偶尔加心情图标

### 响应式断点
```css
/* 移动设备 */
@media (max-width: 768px) {
    /* 单列布局 */
}

/* 平板设备 */
@media (min-width: 769px) and (max-width: 1024px) {
    /* 双列布局 */
}

/* 桌面设备 */
@media (min-width: 1025px) {
    /* 三列布局 */
}
```

## 代码生成规则

### HTML 文件规范
1. **语义化标签**：使用 `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>` 等
2. **无障碍性**：添加 ARIA 标签和 alt 属性
3. **SEO 优化**：合理的 meta 标签和标题层级
4. **字符编码**：UTF-8
5. **语言声明**：`lang="zh-CN"`

### CSS 规范
1. **命名规范**：使用 BEM 命名法或语义化类名
2. **组织结构**：
   - CSS 变量定义
   - 重置样式
   - 布局样式
   - 组件样式
   - 响应式样式
3. **性能优化**：避免深层嵌套，使用 CSS 变量
4. **浏览器兼容**：考虑主流浏览器

### JavaScript 规范
1. **简洁为主**：优先使用原生 JavaScript
2. **模块化**：功能分离，便于维护
3. **性能优化**：事件委托，防抖节流
4. **渐进增强**：确保无 JS 时基本功能可用

## 文章模板

### Markdown 文章模板（未来使用）
```markdown
---
title: "文章标题"
date: 2024-12-20
categories: ["人生感悟"]
tags: ["成长", "思考"]
excerpt: "这是文章的摘要，用于在列表页显示..."
---

# 文章标题

文章正文内容...

## 小标题

段落内容...
```

### HTML 文章模板（当前使用）
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文章标题 | 随想录</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body>
    <header class="site-header">
        <nav class="nav-container">
            <a href="../index.html" class="logo">随想录</a>
            <ul class="nav-links">
                <li><a href="../index.html">首页</a></li>
                <li><a href="../posts.html">文章</a></li>
                <li><a href="../about.html">关于我</a></li>
            </ul>
        </nav>
    </header>

    <main class="main-content">
        <article class="post-detail">
            <header class="post-header">
                <div class="post-meta">
                    <span class="post-date">2024年12月20日</span>
                    <span class="post-category">分类名称</span>
                </div>
                <h1 class="post-title">文章标题</h1>
            </header>
            
            <div class="post-content">
                <!-- 文章内容 -->
            </div>
        </article>
    </main>

    <footer class="site-footer">
        <div class="footer-content">
            <p>© 2024 随想录 | 用心记录每一刻</p>
        </div>
    </footer>
</body>
</html>
```

## 文件结构

```
blog/
├── .github/
│   └── copilot-instructions.md  # Copilot 开发指南
├── css/
│   └── style.css                # 主样式文件
├── posts/
│   ├── reflection-on-growth.html     # 示例：人生感悟
│   ├── 2025-plans.html              # 示例：年度计划
│   └── daily-thoughts.html          # 示例：随想杂记
├── index.html                   # 首页
├── posts.html                   # 文章列表页
├── about.html                   # 关于页面
└── README.md                    # 项目说明
```

## 开发工作流

### 添加新文章
1. 在 `posts/` 目录下创建新的 HTML 文件
2. 使用文章模板编写内容
3. 在 `index.html` 的"最新文章"区域添加文章卡片（最多 3 篇）
4. 在 `posts.html` 的文章列表中添加文章卡片
5. 确保日期格式统一：`YYYY年MM月DD日`
6. 确保分类一致：人生感悟、年度计划、随想杂记

### 修改样式
1. 编辑 `css/style.css`
2. 遵循已有的 CSS 变量和命名规范
3. 测试响应式布局（手机、平板、桌面）
4. 确保不破坏现有设计风格

### 部署流程
1. 提交代码到 GitHub
2. GitHub Pages 自动构建部署
3. 访问 `https://[username].github.io/blog/` 查看效果（将 [username] 替换为实际的 GitHub 用户名）

## 注意事项

### 必须遵守
- ✅ 保持简约优雅的设计风格
- ✅ 确保响应式设计在所有设备上正常工作
- ✅ 使用语义化 HTML 标签
- ✅ 保持代码整洁，适当注释
- ✅ 遵循已有的命名和组织规范
- ✅ 优先考虑内容的可读性

### 避免做的事
- ❌ 不要添加复杂的动画效果
- ❌ 不要使用过多的图片和媒体资源
- ❌ 不要引入大型框架（如 React、Vue）
- ❌ 不要破坏现有的简约风格
- ❌ 不要添加广告或跟踪代码
- ❌ 不要使用过于鲜艳的颜色
- ❌ 不要创建复杂的导航结构

## 常见任务示例

### 1. 添加新文章
创建新文件 `posts/new-article.html`，使用文章模板，然后在首页和文章列表页添加引用。

### 2. 修改配色
编辑 `css/style.css` 中的 CSS 变量（如 `--primary-color`），颜色会全局应用。

### 3. 调整布局间距
修改 `css/style.css` 中的 padding 和 margin 值，保持整体协调。

### 4. 优化移动端体验
在 `@media (max-width: 768px)` 媒体查询中调整样式。

## 未来改进方向

### 高优先级
- [ ] 迁移到 Hugo 或 Hexo 静态站点生成器
- [ ] 支持 Markdown 写作
- [ ] 实现文章归档页面

### 中优先级
- [ ] 添加搜索功能
- [ ] 添加 RSS 订阅
- [ ] 支持文章标签系统
- [ ] 优化 SEO

### 低优先级
- [ ] 添加评论系统（如 Giscus）
- [ ] 实现暗色模式

---

**记住**：这是一个个人博客，重点是内容和阅读体验。保持简约、优雅、舒适是核心原则。
