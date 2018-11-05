import { configure, addDecorator } from '@storybook/react';
import centered from '@storybook/addon-centered';
import { withKnobs } from '@storybook/addon-knobs';
import { configureViewport } from '@storybook/addon-viewport';

function loadStories() {
  require('../src/stories');
}

addDecorator(centered);
addDecorator(withKnobs);
configureViewport();

configure(loadStories, module);
