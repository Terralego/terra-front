import React from 'react';

export const Rect = ({ color, size }) => (
  <div className="tf-legend__symbol">
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
    >
      <rect fill={color} x="0" y="0" width="100" height="100" />
    </svg>
  </div>
);

export default Rect;
