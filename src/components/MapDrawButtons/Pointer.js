import React from 'react';

export default props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
  >
    <polygon
      fill="none"
      stroke={props.color || '#000000'}
      strokeWidth="2"
      points="11.5 22.5 14.5 14.5 22.5 11.5 3.5 3.5 11.5 22.5"
    />
  </svg>

);
