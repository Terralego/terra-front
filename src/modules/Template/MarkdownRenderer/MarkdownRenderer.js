import React from 'react';
import Markdown from 'react-markdown';
import nunjucks from 'nunjucks';

import HistoryLink from '../HistoryLink';

export const MarkdownRenderer = ({ template, content, history, ...props }) => {
  const source = template
    ? nunjucks.renderString(template, props)
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
