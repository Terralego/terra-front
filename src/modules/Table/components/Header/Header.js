import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from '@blueprintjs/core';

import ColumnsSelector from '../ColumnsSelector';

import './styles.scss';

export const Header = ({ children, title, columns, onChange }) => (children || (
  <Navbar className="table-header">
    <Navbar.Group>
      <ColumnsSelector
        columns={columns}
        onChange={onChange}
      />
    </Navbar.Group>
    {title && (
      <Navbar.Group className="table-header__title">
        <Navbar.Heading>{title}</Navbar.Heading>
      </Navbar.Group>
    )}
  </Navbar>
));

Header.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
};

Header.defaultProps = {
  title: '',
  onChange () {},
};

export default Header;
