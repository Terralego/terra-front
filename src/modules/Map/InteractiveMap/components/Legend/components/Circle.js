import React from 'react';

export const Circle = ({ color, size = 16, strokeColor = '#111111', strokeWidth = 1 }) => (
  <div className="tf-legend__symbol">
    <svg
      viewBox={`0 0 ${size + strokeWidth * 2} ${size + strokeWidth * 2}`}
      width={size}
      height={size}
    >
      <circle
        fill={color}
        cx={size / 2 + strokeWidth}
        cy={size / 2 + strokeWidth}
        r={size / 2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  </div>
);

export default Circle;
