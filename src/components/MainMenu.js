import React from 'react';
import {
  Navbar,
  NavbarGroup,
} from '@blueprintjs/core';
import PropTypes from 'prop-types';

import NavBarItemDesktop from './NavBarItemDesktop';
import NavBarItemTablet from './NavBarItemTablet';

import withDeviceSize from '../hoc/withDeviceSize';
import { connectAuthProvider } from '../modules/Auth';


/* eslint-disable react/no-array-index-key */
export const MainMenu = ({
  isMobileSized,
  navItems,
}) => (
  <Navbar className="navBar bp3-dark">
    {
          navItems.map((group, index) => (
            <NavbarGroup key={index} className="navBar__group">
              {group.map(({ component: Component = isMobileSized
                ? NavBarItemTablet : NavBarItemDesktop, ...item }) => (
                  <Component
                    key={item.label}
                    icon={item.icon}
                    {...item}
                  />
              ))}
            </NavbarGroup>
          ))
        }
  </Navbar>
);

MainMenu.propTypes = {
  isMobileSized: PropTypes.bool,
  navItems: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        icon: PropTypes.string,
      }),
    ),
  ),
};

MainMenu.defaultProps = {
  isMobileSized: false,
  navItems: [],
};

export default withDeviceSize()(connectAuthProvider('authenticated', 'logoutAction')(MainMenu));
