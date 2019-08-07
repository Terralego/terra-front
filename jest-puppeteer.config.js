module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
    defaultViewport: { width: 1240, height: 850 },
    // slowMo: 100,
  },
  server: {
    command: 'serve -l 5555 -d storybook-static',
    port: 5555,
    debug: true,
  },
};
