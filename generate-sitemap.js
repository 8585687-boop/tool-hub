import fs from 'fs';
import { tools, pages } from './src/data/tools.js';

// 你的网站域名（必须正确）
const BASE_URL = 'https://devforgekit.com';

// 生成 XML
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

<!-- 首页 -->
<url>
<loc>${BASE_URL}/</loc>
<lastmod>${new Date().toISOString()}</lastmod>
<changefreq>daily</changefreq>
<priority>1.0</priority>
</url>
`;

// 自动生成所有工具页面
tools.forEach(tool => {
  const url = `${BASE_URL}${tool.path}`;
  sitemap += `
<url>
<loc>${url}</loc>
<lastmod>${new Date().toISOString()}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>`;
});

// 自动生成静态页面
pages.forEach(page => {
  const url = `${BASE_URL}${page.path}`;
  sitemap += `
<url>
<loc>${url}</loc>
<lastmod>${new Date().toISOString()}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.5</priority>
</url>`;
});

sitemap += '\n</urlset>';

// 写入 public 目录
fs.writeFileSync('./public/sitemap.xml', sitemap, 'utf8');

console.log('✅ sitemap.xml 已成功生成！位置：public/sitemap.xml');