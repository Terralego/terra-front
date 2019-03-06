/* eslint-disable no-restricted-syntax, no-await-in-loop */
const queryString = require('query-string');

const appRoot = 'http://localhost:5555';

describe('Default page', () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await page.goto(appRoot, { waitUntil: 'networkidle0' });
  });

  it('should display main title', async () => {
    const currentHref = await page.evaluate(() => document.location.href);
    const { selectedStory } = queryString.parse(currentHref);

    await page.goto(`${appRoot}/iframe.html?${queryString.stringify({ selectedStory })}`);
    await expect(page).toMatch('Terra Front Storybook');
  });

  it('should work', async () => {
    await page.goto(appRoot);
    await expect(page).toClick('[role="menuitem"]', { test: 'Modules' });
  });
});

describe('All stories', () => {
  beforeAll(async () => {
    await page.goto(appRoot);

    /**
     * Expand all stories in Storybook tree & store all links in global scope
     */
    const stories = await page.evaluate(() => {
      const expandAll = () => [...document.querySelectorAll('[role="menuitem"]')]
        .forEach(menuitem => !menuitem.nextSibling.textContent && menuitem.click());

      expandAll();
      expandAll();

      window.stories = [...document.querySelectorAll('ul a')].map(a => ({
        title: a.textContent,
        query: a.href.split('?').pop(),
      }));
      return window.stories;
    });

    return stories;
  });

  it('should render correctly', async () => {
    const stories = await page.evaluate(() => window.stories);
    const previewPage = await browser.newPage();

    for (const story of stories) {
      const { query } = story;
      const ressource = await previewPage.goto(`${appRoot}/iframe?${query}`);
      await expect(ressource).toBeDefined();
    }
  });
});
