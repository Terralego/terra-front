import React from 'react';

import MarkdownRenderer from '../../../../Template/MarkdownRenderer';
import FeatureProperties from '../../../FeatureProperties';

export const Tooltip = ({ fetch, properties, ...props }) => (
  <FeatureProperties
    {...fetch}
    properties={properties}
  >
    {allProperties => (
      <MarkdownRenderer
        {...props}
        {...allProperties}
      />
    )}
  </FeatureProperties>
);

export default Tooltip;
