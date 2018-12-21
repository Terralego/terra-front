import React from 'react';
import { Button } from '@blueprintjs/core';

import MarkdownRenderer from '../../../../Template/MarkdownRenderer';
import './styles.scss';

export const Details = ({ visible, template, onClose = () => null, ...props }) => (
  <div className={`view-details ${visible ? 'view-details--visible' : ''}`}>
    <Button
      type="button"
      className="view-details__close-button"
      onClick={onClose}
      icon="cross"
    />
    {visible && (
      <MarkdownRenderer
        template={template}
        {...props}
      />
    )}
  </div>
);

export default Details;
