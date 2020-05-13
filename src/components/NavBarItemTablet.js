import React from 'react';
import PropTypes from 'prop-types';

import HeaderLink from './HeaderLink';
import HeaderButton from './HeaderButton';

export const NavBarItemTablet = ({
  id,
  label,
  href,
  onClick,
  icon,
}) => (
  <HeaderLink
    href={href}
    onClick={onClick}
    data-link-id={id}
    exact
  >
    <p className="header-button-label">{label}</p>
    <HeaderButton
      id={id}
      icon={icon}
      alt={label}
    />
  </HeaderLink>
);

NavBarItemTablet.propTypes = {
  id: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.string,
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
