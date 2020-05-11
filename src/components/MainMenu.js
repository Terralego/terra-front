import React from 'react';
import {
  Classes,
  Navbar,
  NavbarGroup,
} from '@blueprintjs/core';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import NavBarItemDesktop from './NavBarItemDesktop';
import NavBarItemTablet from './NavBarItemTablet';

import withDeviceSize from '../hoc/withDeviceSize';
import { connectAuthProvider } from '../modules/Auth';

export const MainMenu = ({
  className,
  isMobileSized,
  isPhoneSized,
  navItems,
  ...props
}) => {
  if (!navItems.length) {
    return null;
  }

  const defaultComponent = isMobileSized ? NavBarItemTablet : NavBarItemDesktop;

  return (
    <Navbar className={classnames(['navBar', Classes.DARK, className])} {...props}>
      {navItems.map((group, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <NavbarGroup key={index} className="navBar__group">
          {group.map(({ component: Component = defaultComponent, ...item }) => (
            <Component
              key={item.id}
              {...item}
            />
          ))}
        </NavbarGroup>
      ))}
    </Navbar>
  );
};

MainMenu.propTypes = {
  className: PropTypes.string,
  isMobileSized: PropTypes.bool,
  isPhoneSized: PropTypes.bool,
  navItems: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        component: PropTypes.func,
        href: PropTypes.string,
        icon: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
        id: PropTypes.string,
        label: PropTypes.string,
      }),
    ),
  ),
};

MainMenu.defaultProps = {
  className: '',
  isMobileSized: false,
  isPhoneSized: false,
  navItems: [],
};

export default withDeviceSize()(connectAuthProvider('authenticated', 'logoutAction')(MainMenu));
