import React from 'react';

import Template from '../../../../Template/Template';
import FeatureProperties from '../../../FeatureProperties';

export const Tooltip = ({ fetch, properties, ...props }) => (
  <FeatureProperties
    {...fetch}
    properties={properties}
  >
    {allProperties => (
      <Template
        {...props}
        {...allProperties}
      />
    )}
  </FeatureProperties>
);

export default Tooltip;
