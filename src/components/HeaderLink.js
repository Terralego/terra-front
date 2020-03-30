import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

export const HeaderLink = ({ href, children, ...props }) => {
  if (!href) return <span {...props}>{children}</span>;

  if (href.match(/^http/)) return <a className="header-link" href={href} {...props}>{children}</a>;

  return (
    <NavLink to={href} {...props}>{children}</NavLink>
  );
};

HeaderLink.propTypes = {
  children: PropTypes.element.isRequired,
  href: PropTypes.string,
};

HeaderLink.defaultProps = {
  href: '',
};
export default HeaderLink;
