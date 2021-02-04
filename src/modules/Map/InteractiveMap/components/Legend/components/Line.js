import React from 'react';

export const Line = ({ color, size = 16, strokeWidth = 2, strokeColor = color }) => (
  <div className="tf-legend__symbol">
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
    >
      <line x1="0" y1="0" x2={size} y2={size} style={{ stroke: strokeColor, 'stroke-width': strokeWidth }} />
    </svg>
  </div>
);

export default Line;
