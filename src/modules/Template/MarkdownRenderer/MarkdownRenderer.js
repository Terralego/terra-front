import React from 'react';
import Markdown from 'react-markdown';
import nunjucks from 'nunjucks';
import slugify from 'slugify';
import HistoryLink from '../HistoryLink';

const env = nunjucks.configure();
env.addFilter('slug', value => slugify(`${value || ''}`.toLowerCase()));

export const MarkdownRenderer = ({ template, content, history, ...props }) => {
  const source = template
    ? env.renderString(template, props)
    : content;

  return (
    <Markdown
      source={source}
      escapeHtml={false}
      renderers={{ link: historyProps => <HistoryLink {...historyProps} history={history} /> }}
    />
  );
};

export default MarkdownRenderer;
