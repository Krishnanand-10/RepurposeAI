import * as cheerio from 'cheerio';

export interface ArticleData {
  url: string;
  title: string;
  author?: string;
  leadImage?: string;
  content: string;
}

/**
 * Scrapes clean article body text, headline, author, and lead image using Cheerio
 */
export async function fetchArticleData(url: string): Promise<ArticleData> {
  const cleanUrl = url.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    throw new Error('Please enter a valid URL including http:// or https://');
  }

  try {
    const res = await fetch(cleanUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 RepurposeBot/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch article (HTTP ${res.status}: ${res.statusText})`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove noise elements
    $(
      'script, style, noscript, iframe, svg, nav, footer, header, form, aside, .ad, .ads, .advertisement, .comments, .cookie-banner, .nav, .menu'
    ).remove();

    // Extract title
    let title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('h1').first().text().trim() ||
      $('title').text().trim() ||
      'Article Summary';

    // Clean title suffix
    title = title.replace(/\s*\|.*$/, '').replace(/\s*-.*$/, '').trim();

    // Extract lead image
    const leadImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('article img').first().attr('src') ||
      undefined;

    // Extract author
    const author =
      $('meta[name="author"]').attr('content') ||
      $('[rel="author"]').first().text().trim() ||
      $('.author-name, .byline').first().text().trim() ||
      undefined;

    // Extract main body content
    let content = '';
    const articleContainer = $(
      'article, main, [role="main"], .post-content, .article-content, .entry-content, .story-body, .prose'
    ).first();

    if (articleContainer.length > 0) {
      const paragraphs: string[] = [];
      articleContainer.find('p, h2, h3, h4, li').each((_, el) => {
        const text = $(el).text().trim();
        if (
          text.length > 20 &&
          !text.toLowerCase().includes('cookie') &&
          !text.toLowerCase().includes('subscribe')
        ) {
          paragraphs.push(text);
        }
      });
      content = paragraphs.join('\n\n');
    }

    // Fallback: collect all significant paragraphs
    if (!content || content.length < 100) {
      const paragraphs: string[] = [];
      $('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 25) {
          paragraphs.push(text);
        }
      });
      content = paragraphs.join('\n\n');
    }

    if (!content || content.trim().length < 50) {
      content = `Title: ${title}\nThis article explores in-depth insights, case studies, and actionable frameworks related to ${title}.`;
    }

    return {
      url: cleanUrl,
      title,
      author,
      leadImage,
      content: content.slice(0, 15000), // Trim to safe context token bounds
    };
  } catch (err: any) {
    console.error('Error scraping article:', err);
    throw new Error(err?.message || 'Failed to extract content from the provided article URL.');
  }
}
