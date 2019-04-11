import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';

function loadStories() {
  require('../src/stories');
}

addDecorator(withKnobs);
addDecorator(withA11y);

configure(loadStories, module);
