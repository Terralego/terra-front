import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select as BPSelect } from '@blueprintjs/select';

import './index.scss';

export class Select extends React.Component {
  static propTypes = {
    locales: PropTypes.shape({ noResults: PropTypes.string }),
    label: PropTypes.string,
    onChange: PropTypes.func,
    values: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    locales: { noResults: 'No results.' },
    label: '',
    values: [],
    onChange () {},
  }

  componentDidMount () {
    const { onChange, values: [value] } = this.props;
    onChange(value);
  }

  handleChange = value => {
    const { onChange } = this.props;
    onChange(value);
  }

  handleClick = value => () => this.handleChange(value);

  render () {
    const {
      label,
      values,
      values: [defaultValue],
      locales: { noResults },
      value,
    } = this.props;
    const { handleChange, handleClick } = this;

    return (
      <div className="control-container">
        <p className="control-label">{label}</p>
        <BPSelect
          popoverProps={{ usePortal: false }}
          items={values}
          filterable={values.length > 9}
          itemRenderer={val => <MenuItem onClick={handleClick(val)} key={val} text={val} />}
          noResults={<MenuItem disabled text={noResults} />}
          onItemSelect={handleChange}
        >
          <Button text={value || defaultValue} rightIcon="double-caret-vertical" />
        </BPSelect>
      </div>
    );
  }
}

export default Select;
