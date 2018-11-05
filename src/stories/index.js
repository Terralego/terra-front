import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';
import { text } from '@storybook/addon-knobs';

const stories = storiesOf('Exemple', module);

stories.add('with some emoji', () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      {text('Content', '😀 😎 👍 💯')}
    </span>
  </Button>
));
