import React from 'react';

import { Tooltip as BpTooltip } from '@blueprintjs/core';
import withDeviceSize from '../hoc/withDeviceSize';

export const Tooltip = ({ isMobileSized, children, ...props }) => (
  isMobileSized
    ? children
    : (
      <BpTooltip {...props}>
        {children}
      </BpTooltip>
    )
);
export default withDeviceSize()(Tooltip);
