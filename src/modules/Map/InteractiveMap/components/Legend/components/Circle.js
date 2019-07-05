import React from 'react';

export const Circle = ({ color, size }) => (
  <div className="tf-legend__symbol">
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
    >
      <circle fill={color} cx="50" cy="50" r="50" />
    </svg>
  </div>
);

export default Circle;
