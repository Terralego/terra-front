import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean } from '@storybook/addon-knobs';

import { MarkdownRenderer } from '../../../modules/Template/MarkdownRenderer';

const stories = storiesOf('Modules/Template', module);

stories.add('MarkdownRenderer Component', () => (
  <MarkdownRenderer
    template={`
# {{title}}

{% if displayLogo %}
![logo](https://makina-corpus.com/logo.svg)
{% endif %}

## {{subtitle}}

{{text}}

{% if text.length > 30 %}
Cool story bro
{% endif %}

<p><strong>Some</strong> <code>HTML</code></p>
    `}
    title={text('Title', 'Some title')}
    subtitle={text('Subtitle', 'Some subtitle')}
    text={text('Text', 'Some text')}
    displayLogo={boolean('Display logo ?', true)}
  />
));
