import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export const HeaderLink = ({ className, href, link, ...props }) => {
  const {
    component: Component,
    linkProps: { hrefAttribute, ...linkProps },
  } = link || {
    component: href ? 'a' : 'span',
    linkProps: { hrefAttribute: 'href' },
  };

  const hrefProp = href && {
    [hrefAttribute]: href,
  };

  return (
    <Component
      className={classnames(['header-link', className])}
      {...hrefProp}
      {...linkProps}
      {...props}
    />
  );
};

HeaderLink.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  href: PropTypes.string,
  link: PropTypes.shape({
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.elementType, PropTypes.string]),
    linkProps: PropTypes.shape({
      hrefAttribute: PropTypes.string,
    }),
  }),
};

HeaderLink.defaultProps = {
  className: '',
  href: '',
  link: undefined,
};

export default HeaderLink;
