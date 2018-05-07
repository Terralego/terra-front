import React from 'react';

export default props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    x="0px"
    y="0px"
  >
    <polygon
      fill="none"
      stroke={props.color || '#000000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      points="11.5 22.5 14.5 14.5 22.5 11.5 3.5 3.5 11.5 22.5"
    />
  </svg>

);
