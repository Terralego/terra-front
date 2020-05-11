import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Classes, Button } from '@blueprintjs/core';

const getIcon = (icon, alt) => {
  if (!icon) {
    return null;
  }
  const isPathIcon = typeof icon === 'string' && icon.includes('.');
  return !isPathIcon
    ? icon
    : (
      <span className={Classes.ICON}>
        <img src={icon} alt={alt} />
      </span>
    );
};


export const HeaderButton = ({ alt, className, icon, ...props }) => {
  const formattedIcon = getIcon(icon, alt);

  return (
    <Button
      className={classnames(['header-button', className])}
      icon={formattedIcon}
      minimal
      text={!formattedIcon && alt}
      {...props}
    />
  );
};

HeaderButton.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
};

HeaderButton.defaultProps = {
  alt: '',
  className: '',
  icon: undefined,
};

export default HeaderButton;
