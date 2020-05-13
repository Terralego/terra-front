import React from 'react';
import PropTypes from 'prop-types';

import {
  Position,
  Tooltip,
} from '@blueprintjs/core';

import HeaderLink from './HeaderLink';
import HeaderButton from './HeaderButton';

export const NavBarItemDesktop = ({
  id,
  content,
  label,
  href,
  onClick,
  icon,
}) => (
  <Tooltip
    content={label}
    position={Position.RIGHT}
    usePortal={false}
  >
    <HeaderLink
      href={href}
      onClick={onClick}
      data-link-id={id}
      exact
    >
      <HeaderButton
        id={id}
        icon={icon}
        alt={label}
      >
        {content}
      </HeaderButton>
    </HeaderLink>
  </Tooltip>
);

NavBarItemDesktop.propTypes = {
  id: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  label: PropTypes.string,
  content: PropTypes.string,
  onClick: PropTypes.func,
};

NavBarItemDesktop.defaultProps = {
  id: null,
  href: '',
  icon: '',
  label: '',
  content: '',
  onClick () {},
};

export default NavBarItemDesktop;
