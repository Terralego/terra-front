import React from 'react';
import PropTypes from 'prop-types';
import { darken } from 'color2k';

export const Rect = ({ color, size, strokeColor = darken(color, 0.1), strokeWidth }) => !!color && (
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

Rect.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  strokeColor: PropTypes.string,
  strokeWidth: PropTypes.number,
};

Rect.defaultProps = {
  color: null,
  size: 16,
  strokeColor: undefined,
  strokeWidth: 1,
};

export default Rect;
