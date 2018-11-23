import React from 'react';
import Markdown from 'react-markdown';

function replaceProps (content, props) {
  let source = content;
  Object.keys(props).forEach(key => {
    source = source.replace(new RegExp(`{{${key}}}`, 'g'), props[key]);
  });
  return source;
}

export const MarkdownRenderer = ({ content, ...props }) => {
  const source = replaceProps(content, props);

  return (
    <Markdown
      source={source}
    />
  );
};

export default MarkdownRenderer;
