import React from 'react';

export const Rect = ({ color, size = 16, strokeColor = '#444444', strokeWidth = 1 }) => (
  <div className="tf-legend__symbol">
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
    >
      <rect
        fill={color}
        x="0"
        y="0"
        width={size}
        height={size}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  </div>
);

export default Rect;
