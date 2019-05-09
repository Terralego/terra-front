import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { withInfo} from '@storybook/addon-info';
import ThemeSwitcher from './ThemeSwitcher';
import './styles.scss';
function loadStories() {
  require('../src/stories');
  const req = require.context('../src/stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

// It is important to declare this decorator as the first decorator, otherwise it won't work well.
// https://github.com/storybooks/storybook/tree/next/addons/info
addDecorator(withInfo({
  source: true
}));
addDecorator(withKnobs);
addDecorator(withA11y);
addDecorator(ThemeSwitcher);


configure(loadStories, module);
