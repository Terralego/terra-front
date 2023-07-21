import React from 'react';
import PropTypes from 'prop-types';

import HeaderLink from './HeaderLink';
import HeaderButton from './HeaderButton';

const nullObj = {};

export const NavBarItemTablet = ({
  id,
  label,
  href,
  icon,
  buttonProps = nullObj,
  ...props
}) => (
  <HeaderLink
    data-link-id={id}
    href={href}
    {...props}
  >
    <p className="header-button-label">{label}</p>
    <HeaderButton
      component={href ? 'span' : undefined}
      id={id}
      icon={icon}
      alt={label}
      {...buttonProps}
    />
  </HeaderLink>
);

NavBarItemTablet.propTypes = {
  id: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  label: PropTypes.string,
  onClick: PropTypes.func,
};

NavBarItemTablet.defaultProps = {
  id: null,
  href: '',
  icon: '',
  label: '',
  onClick () {},
};

export default NavBarItemTablet;
