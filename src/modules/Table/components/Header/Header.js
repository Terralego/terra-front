import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Popover, Position, Navbar } from '@blueprintjs/core';

import './styles.scss';

export const Header = ({ title, columns, onChange }) => {
  const options = (
    <div className="table-header__options">
      {columns.map(({ value, display }, index) => (
        <Checkbox
          onChange={event => onChange({ event, index })}
          key={value}
          label={value}
          defaultChecked={display}
          value={value}
        />
      ))}
    </div>
  );
  return (
    <Navbar className="table-header">
      <Navbar.Group>
        <Popover content={options} position={Position.RIGHT_BOTTOM}>
          <Button icon="properties" minimal intent="primary" />
        </Popover>
      </Navbar.Group>
      {title && (
        <Navbar.Group className="table-header__title">
          <Navbar.Heading>{title}</Navbar.Heading>
        </Navbar.Group>
      )}
    </Navbar>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
};

Header.defaultProps = {
  title: '',
  onChange: () => {},
};

export default Header;
