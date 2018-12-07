import React from 'react';
import { Icon } from '@blueprintjs/core';

import MarkdownRenderer from '../MarkdownRenderer';

export const Details = ({ visible, template, onClose = () => null, ...props }) => (
  <div className={`view-details ${visible ? 'view-details--visible' : ''}`}>
    <button
      type="button"
      className="view-details__close-button"
      onClick={onClose}
    >
      <Icon icon="cross" />
    </button>
    {visible && (
      <MarkdownRenderer
        template={template}
        {...props}
      />
    )}
  </div>
);

export default Details;
