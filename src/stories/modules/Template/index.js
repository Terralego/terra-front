import { storiesOf } from '@storybook/react';
import { text, boolean } from '@storybook/addon-knobs';

import MarkdownRendererView from './MarkdownRenderer';

const stories = storiesOf('Modules/Template/', module);

stories.add('Markdown Renderer', MarkdownRendererView);
