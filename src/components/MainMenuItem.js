import React from 'react';
import PropTypes from 'prop-types';
import withDeviceSize from '../hoc/withDeviceSize';

import NavBarItemDesktop from './NavBarItemDesktop';
import NavBarItemTablet from './NavBarItemTablet';

const MainMenuItem = ({ component, isMobileSized, id, ...props }) => {
  const defaultComponent = isMobileSized ? NavBarItemTablet : NavBarItemDesktop;
  const Component = component || defaultComponent;

  return (
    <Component
      key={id}
      id={id}
      {...props}
    />
  );
};

MainMenuItem.propTypes = {
  component: PropTypes.node,
  isMobileSized: PropTypes.bool,
  id: PropTypes.string,
};

MainMenuItem.defaultProps = {
  component: null,
  isMobileSized: false,
  id: undefined,
};

export default withDeviceSize()(MainMenuItem);
