import React from 'react';
import {
  Classes,
  Navbar,
  NavbarHeading,
  NavbarGroup,
} from '@blueprintjs/core';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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
        <NavbarHeading className="navBar__header">
          <MainMenuItem {...navHeader} />
        </NavbarHeading>
      )}
      {navItems.length > 0 && navItems.map((group, index) => (
        <NavbarGroup
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className={classnames({
            navBar__group: true,
            navBar__group__empty: group.length === 0,
          })}
        >
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

export default MainMenu;
