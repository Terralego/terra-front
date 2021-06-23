import React from 'react';

import Template from '../../../../Template/Template';
import FeatureProperties from '../../../FeatureProperties';
import ErrorBoundary from '../../../../../components/ErrorBoundary';

export const Tooltip = ({ fetch, properties, ...props }) => (
  <FeatureProperties
    {...fetch}
    properties={properties}
  >
    {allProperties => (
      <ErrorBoundary>
        <Template
          {...props}
          {...allProperties}
        />
      </ErrorBoundary>
    )}
  </FeatureProperties>
);

export default Tooltip;
