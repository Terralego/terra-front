import React from 'react';
import Markdown from 'react-markdown';
import nunjucks from 'nunjucks';

export const MarkdownRenderer = ({ template, content, ...props }) => {
  const source = template
    ? nunjucks.renderString(template, props)
    : content;

  return (
    <Markdown
      source={source}
      escapeHtml={false}
    />
  );
};

export default MarkdownRenderer;
