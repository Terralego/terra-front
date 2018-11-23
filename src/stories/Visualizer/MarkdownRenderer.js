import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import { MarkdownRenderer } from '../../modules/Visualizer/';

const stories = storiesOf('Module Visualizer');

stories.add('MarkdownRenderer Component', () => (
  <MarkdownRenderer
    content={`
# Some title

## Some subtitle

Some text with some variables like foo: {{foo}} or bar: {{bar}}
    `}
    foo={text('Foo', 'foo')}
    bar={text('Bar', 'bar')}
  />
));
