import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Popover, Position, Intent } from '@blueprintjs/core';

export const ColumnsSelector = ({ columns, onChange, icon, position, intent }) => {
  const options = (
    <div className="table-columns-selector__options">
      {columns.map(({ value, display, label = value }, index) => (
        <Checkbox
          onChange={event => onChange({ event, index })}
          key={value}
          label={label}
          defaultChecked={display}
          value={value}
        />
      ))}
    </div>
  );
  return (
    <Popover
      content={options}
      position={position}
      popoverClassName="table-columns-selector__options-popover"
    >
      <Button
        icon={icon}
        minimal
        intent={intent}
      />
    </Popover>
  );
};

ColumnsSelector.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  icon: PropTypes.string,
  position: PropTypes.string,
  intent: PropTypes.string,
};

ColumnsSelector.defaultProps = {
  onChange () {},
  icon: 'properties',
  position: Position.RIGHT_BOTTOM,
  intent: Intent.PRIMARY,
};

export default ColumnsSelector;
