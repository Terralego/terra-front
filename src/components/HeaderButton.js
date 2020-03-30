import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@blueprintjs/core';

export const HeaderButton = ({ id, icon, alt }) => (
  <Button
    className={`header-button ${id}`}
    minimal
    id={id}
  >
    {icon
      ? <img src={icon} alt={alt} />
      : <span>{alt}</span>}
  </Button>
);

HeaderButton.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.string,
  alt: PropTypes.string,
};

HeaderButton.defaultProps = {
  icon: '',
  alt: '',
};

export default HeaderButton;
