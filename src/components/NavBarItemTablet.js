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
  id: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  icon: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

NavBarItemTablet.defaultProps = {
  icon: '',
  label: '',
  onClick () {},
};

export default NavBarItemTablet;
