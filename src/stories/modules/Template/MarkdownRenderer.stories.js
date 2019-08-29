import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { Template }  from '../../../modules/Template';

const DEFAULT_VALUE = `
# Template component

Template component is able to transform html or markdown template in dom content.
It uses [nunjuncks](https://mozilla.github.io/nunjucks/) templating engine and can
process custom tags.

Exemple text will display after you type more than 3 caracters:

{% if text.length > 3 %}
{{text}}
{% endif %}

{% if displayLogo %}
![logo](https://makina-corpus.com/logo.svg)
{% endif %}

## Custom components

<custom-component>Content in a custom react component</custom-component>

<simple-custom-component>Content in a custom react component with a simple specification</simple-custom-component>

And you can write raw html too:

<p><strong>Some</strong> <code>HTML</code></p>
`;

storiesOf('Components/Template', module)
  .add('Template component', () => {
    const content = text('Markdown content', DEFAULT_VALUE);

    return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <Template
            template={content}
            text={text('Text', 'Some text with [a link](to/the/past)')}
            displayLogo={boolean('Display logo ?', true)}
            history={{
              push: action('click on link'),
            }}
            customComponents={[{
              replaceChildren: true,
              shouldProcessNode: node => node.name && node.name === 'custom-component',
              processNode: (node, children) => (
                <span style={{
                  backgroundColor: 'yellow',
                  color: 'blue',
                  display: 'inline',
                }}
                >
                  {children}
                </span>
              ),
            }, {
              tagName: 'simple-custom-component',
              component: ({ children }) => (
                <span style={{
                  backgroundColor: 'blue',
                  color: 'yellow',
                  display: 'inline',
                }}
                >
                  {children}
                </span>
              ),
            }]}
          />
        </div>
        <div style={{ width: '50%' }}>
          <pre>{content}</pre>
        </div>
      </div>
    );
  }, {
    knobs: {
      timestamps: true, // Doesn't emit events while user is typing.
      escapeHTML: false,
    },
  });
