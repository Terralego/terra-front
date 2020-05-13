import React from 'react';
import {
  Classes,
  Navbar,
  NavbarHeading,
  NavbarGroup,
} from '@blueprintjs/core';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import withDeviceSize from '../hoc/withDeviceSize';
import { connectAuthProvider } from '../modules/Auth';

import MainMenuItem from './MainMenuItem';

export const MainMenu = ({
  className,
  navHeader,
  navItems,
  ...props
}) => {
  if (!navItems.length && !navHeader) {
    return null;
  }

  return (
    <Navbar className={classnames(['navBar', Classes.DARK, className])} {...props}>
      {navHeader && (
        <NavbarHeading>
          <MainMenuItem {...navHeader} />
        </NavbarHeading>
      )}
      {navItems.length > 0 && navItems.map((group, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <NavbarGroup key={index} className="navBar__group">
          <ul>
            {group.map(item => (
              <li key={item.id}>
                <MainMenuItem {...item} />
              </li>
            ))}
          </ul>
        </NavbarGroup>
      ))}
    </Navbar>
  );
};

MainMenu.propTypes = {
  className: PropTypes.string,
  navHeader: PropTypes.shape({
    component: PropTypes.func,
    href: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
    id: PropTypes.string,
    label: PropTypes.string,
  }),
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
  navHeader: undefined,
  navItems: [],
};

export default withDeviceSize()(connectAuthProvider('authenticated', 'logoutAction')(MainMenu));
