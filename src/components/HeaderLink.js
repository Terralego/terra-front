import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

export const HeaderLink = ({ children, className, exact, href, ...props }) => {
  const classes = classnames(['header-link', className]);

  if (!href) {
    return <span className={classes} {...props}>{children}</span>;
  }

  if (href.startsWith('http')) {
    return <a className={classes} href={href} {...props}>{children}</a>;
  }

  return (
    <NavLink className={classes} to={href} exact={exact} {...props}>{children}</NavLink>
  );
};

HeaderLink.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  exact: PropTypes.bool,
  href: PropTypes.string,
};

HeaderLink.defaultProps = {
  className: '',
  exact: false,
  href: '',
};
export default HeaderLink;
