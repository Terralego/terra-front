import React from 'react';

export default props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <g>
      <path
        d="M12.7,0v10.9l3-3l1,1l-4.2,4.2c-0.1,0.1-0.3,0.2-0.5,0.2c-0.2,0-0.4-0.1-0.5-0.2L7.3,8.9l1-1l3.1,3.1l0,0V0H12.7z"
        fill={props.color || '#000000'}
      />
      <rect
        x="9.8"
        y="19"
        width="4.4"
        height="4.4"
        fill={props.color || '#000000'}
      />
    </g>
  </svg>
);
