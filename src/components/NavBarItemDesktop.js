import React from 'react';
import PropTypes from 'prop-types';

import {
  Position,
  Tooltip,
} from '@blueprintjs/core';

import HeaderLink from './HeaderLink';
import HeaderButton from './HeaderButton';
import { connectState } from '../modules/State/context';

const nullObj = {};

export const NavBarItemDesktop = ({
  id,
  content,
  label,
  href,
  icon,
  setForceFitBounds,
  buttonProps = nullObj,
  ...props
}) => (
  <Tooltip
    content={label}
    position={Position.RIGHT}
    usePortal={false}
  >
    <HeaderLink
      data-link-id={id}
      href={href}
      {...props}
    >
      <HeaderButton
        component={href ? 'span' : undefined}
        id={id}
        icon={icon}
        alt={label}
        onClick={() => setForceFitBounds(true)}
        {...buttonProps}
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
  setForceFitBounds: PropTypes.func,
};

NavBarItemDesktop.defaultProps = {
  id: null,
  href: '',
  icon: '',
  label: '',
  content: '',
  onClick () {},
  setForceFitBounds () {},
};

export default connectState('setForceFitBounds')(NavBarItemDesktop);
