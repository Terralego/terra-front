import React from 'react';

const Icon = ({
  size = 16,
  'style-image-file': src,
}) => (
  <img
    className="tf-legend__symbol"
    src={src}
    style={{
      maxWidth: size,
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    }}
    alt=""
  />
);

export default Icon;
