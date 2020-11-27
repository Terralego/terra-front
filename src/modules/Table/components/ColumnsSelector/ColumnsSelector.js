import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Popover, Position, Intent } from '@blueprintjs/core';

const getToggleState = columns =>
  // 1 is all checked
  // 0 is none checked
  // -1 is underminated
  columns.reduce((prev, { display }) => {
    if (prev === -1) return prev;
    if (prev !== undefined && prev !== +display) return -1;
    return +display;
  }, undefined);

export const ColumnsSelector = React.memo(({
  columns, onChange, icon, position, intent, locales: { displayAllColumns, hideAllColumns } = {},
}) => {
  const toggleState = useMemo(() => getToggleState(columns), [columns]);

  const toggleAll = useCallback(({ target: { checked } }) => {
    columns.forEach(({ display }, index) => {
      if (display === checked) return;
      onChange({ event: { target: { checked } }, index });
    });
  }, [columns, onChange]);

  return (
    <Popover
      position={position}
      popoverClassName="table-columns-selector__options-popover"
    >
      <Button
        icon={icon}
        minimal
        intent={intent}
      />
      <div className="table-columns-selector__options">
        <Checkbox
          className="table-columns-selector__toggle-all"
          onChange={toggleAll}
          key="toggle-all"
          label={toggleState ? hideAllColumns : displayAllColumns}
          checked={toggleState > 0}
          indeterminate={toggleState === -1}
        />
        {columns.map(({ value, display, label = value }, index) => (
          <Checkbox
            onChange={event => onChange({ event, index })}
            key={value}
            label={label}
            checked={display}
            value={value}
          />
        ))}
      </div>
    </Popover>
  );
});

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
