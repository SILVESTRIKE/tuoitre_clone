const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const cron = require('node-cron');
const Articles = require('../models/articleModel'); // Sửa đường dẫn import
const Category = require('../models/categoryModel');
const logger = require('../../logging/logger'); // Sửa đường dẫn import

// --- CẤU HÌNH ---
const TARGET_URL = 'https://tuoitre.vn';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36';
const MAX_ARTICLES_PER_CATEGORY = parseInt(process.env.MAX_ARTICLES_PER_CATEGORY || 10, 10);
const RANDOM_DELAY = () => Math.random() * 100 + 50;

// Theo dõi các URL đã crawl trong mỗi chu kỳ
let crawledUrls = new Set();

const crawlData = {
    takeHtmlStructure: async (url) => {
        logger.info(`[JOB START] Bắt đầu tải HTML tại ${url}`);
        try {
            const { data: html } = await axios.get(url, {
                headers: { 'User-Agent': USER_AGENT },
            });
            logger.info('[SUCCESS] Đã tải xong HTML.');
            return html;
        } catch (error) {
            logger.error(`[ERROR] Lỗi tải HTML: ${error.message}`);
            return null;
        }
    },

    crawSlug: async (nameContainer, nameCategory, page, maxArticles) => {
        logger.info(`[JOB START] Bắt đầu crawl slug tại ${TARGET_URL + nameCategory}`);
        try {
            await page.goto(TARGET_URL + nameCategory, { waitUntil: 'networkidle2', timeout: 60000 });
            logger.info(`[SUCCESS] Đã load trang: ${TARGET_URL + nameCategory}`);

            const slugs = await page.$$eval(
                nameContainer,
                (items, max) => items.slice(0, max).map(item => {
                    const aTag = item.querySelector('a');
                    return aTag ? { slug: aTag.getAttribute('href') } : null;
                }).filter(Boolean),
                maxArticles
            );

            // Lọc bỏ slug trùng lặp
            const uniqueSlugs = slugs.filter(({ slug }) => {
                const fullUrl = TARGET_URL + slug;
                if (crawledUrls.has(fullUrl)) {
                    logger.info(`[SKIP] Slug đã crawl: ${fullUrl}`);
                    return false;
                }
                crawledUrls.add(fullUrl);
                return true;
            });

            logger.info(`[INFO] Tìm được ${uniqueSlugs.length} slug trong danh mục ${nameCategory}`);
            return uniqueSlugs;
        } catch (error) {
            logger.error(`[ERROR] Lỗi crawl slug danh mục ${nameCategory}: ${error.message}`);
            return [];
        }
    },

    crawlArticleData: async (slug, idCategory, page) => {
        const maxRetries = 3;
        let attempt = 1;

        while (attempt <= maxRetries) {
            try {
                const fullUrl = TARGET_URL + slug;
                const existingArticle = await Articles.findOne({ url: fullUrl });
                if (existingArticle) {
                    logger.info(`[SKIP] Bài viết đã tồn tại: ${fullUrl}`);
                    return null;
                }

                await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 60000 });

                const articleData = await page.evaluate(() => {
                    const title = document.querySelector('h1')?.innerText.trim() || null;
                    const subtitle = document.querySelector('.detail-sapo')?.innerText.trim() || null;
                    const imgElement = document.querySelector('.VCSortableInPreviewMode img') ||
                        document.querySelector('.detail-thumbnail img');
                    const imgSrc = imgElement?.getAttribute('src') || null;
                    const paragraphs = Array.from(document.querySelectorAll('.detail-content p'))
                        .map(p => p.innerText.trim())
                        .filter(p => p.length > 0);
                    const fullText = paragraphs.join(' ');

                    return { title, sapo: subtitle, image: imgSrc, content: paragraphs, fullText };
                });

                if (!articleData.title) {
                    logger.warn(`[WARN] Không tìm thấy tiêu đề cho bài viết: ${slug}`);
                    return null;
                }

                articleData.slug = slug.replace(/^\//, '').replace(/\.htm$/, '');
                articleData.url = fullUrl;
                articleData.category = idCategory;

                const newArticle = new Articles(articleData);
                await newArticle.save();
                logger.info(`[SUCCESS] Đã lưu bài viết: ${articleData.title}`);
                return newArticle;
            } catch (error) {
                logger.error(`[ERROR] Lỗi crawl bài viết ${slug} (lần thử ${attempt}/${maxRetries}): ${error.message}`);
                if (attempt === maxRetries) return null;
                attempt++;
                await new Promise(resolve => setTimeout(resolve, RANDOM_DELAY()));
            }
        }
    },

    crawlAllArticles: async () => {
        // Reset crawledUrls cho mỗi chu kỳ crawl
        crawledUrls = new Set();
        const browser = await puppeteer.launch({ headless: true });
        try {
            const categories = await Category.find({});
            logger.info(`[INFO] Tìm thấy ${categories.length} danh mục.`);

            for (const category of categories) {
                if (category.name !== 'Video') {
                    const page = await browser.newPage();
                    const slugs = await crawlData.crawSlug(
                        'div#load-list-news div.box-category-item',
                        '/' + category.slug + '.htm',
                        page,
                        MAX_ARTICLES_PER_CATEGORY
                    );

                    if (slugs.length === 0) {
                        logger.warn(`[WARN] Không tìm thấy bài viết trong danh mục: ${category.name}`);
                        await page.close();
                        continue;
                    }

                    for (const { slug } of slugs) {
                        const articlePage = await browser.newPage();
                        await crawlData.crawlArticleData(slug, category._id, articlePage);
                        await articlePage.close();
                        await new Promise(resolve => setTimeout(resolve, RANDOM_DELAY()));
                    }

                    await page.close();
                }
            }
        } catch (error) {
            logger.error(`[ERROR] Lỗi crawl tất cả bài viết: ${error.message}`);
        } finally {
            await browser.close();
            logger.info('[JOB END] Kết thúc crawl tất cả bài viết.');
        }
    },

    crawlCategory: async () => {
        logger.info(`[JOB START] Bắt đầu crawl danh mục tại ${TARGET_URL}`);
        const html = await crawlData.takeHtmlStructure(TARGET_URL);
        if (!html) return;

        try {
            const $ = cheerio.load(html);
            const categories = [];

            $('ul.menu-nav > li > a').each((index, element) => {
                const newsItem = $(element);
                const titleCategory = newsItem.text().trim();
                let slug = newsItem.attr('href');

                if (titleCategory && slug && slug.match(/\.htm$/)) {
                    const cleanSlug = slug.replace(/^\//, '').replace(/\.htm$/, '');
                    const url = `${TARGET_URL}/${cleanSlug}.htm`;
                    categories.push({ name: titleCategory, slug: cleanSlug, url });
                }
            });

            logger.info(`[INFO] Tìm thấy ${categories.length} danh mục.`);

            for (const { name, slug, url } of categories) {
                const existingCategory = await Category.findOne({ slug });
                if (existingCategory) {
                    logger.info(`[SKIP] Danh mục đã tồn tại: ${name}`);
                    continue;
                }

                const category = new Category({ name, slug, url });
                await category.save();
                logger.info(`[SUCCESS] Đã lưu danh mục: ${name} - ${slug} - ${url}`);
            }
        } catch (error) {
            logger.error(`[ERROR] Lỗi crawl danh mục: ${error.message}`);
        } finally {
            logger.info(`[JOB END] Kết thúc crawl danh mục.`);
        }
    },

    startCrawl: async () => {
        logger.info('[CRAWL START] Bắt đầu chu kỳ crawl.');
        await crawlData.crawlCategory();
        await crawlData.crawlAllArticles();
        logger.info('[CRAWL END] Kết thúc chu kỳ crawl.');
    },
};

// Lập lịch crawl mỗi 30 phút
cron.schedule('*/30 * * * *', () => {
    logger.info('[CRON] Bắt đầu công việc crawl định kỳ.');
    crawlData.startCrawl();
});

module.exports = crawlData;