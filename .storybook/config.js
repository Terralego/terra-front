import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { configureViewport } from '@storybook/addon-viewport';

function loadStories() {
  require('../src/stories');
}

addDecorator(withKnobs);
configureViewport();

configure(loadStories, module);
