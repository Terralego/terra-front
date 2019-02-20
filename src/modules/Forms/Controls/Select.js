import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select as BPSelect } from '@blueprintjs/select';

import './index.scss';

export class Select extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func,
    values: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    label: '',
    values: [],
    onChange: () => null,
  }

  constructor (props) {
    super(props);
    const { values } = this.props;
    this.state = {
      value: values[0],
    };
  }

  handleChange = value => {
    const { onChange } = this.props;
    this.setState({ value });
    onChange(value);
  }

  handleClick = value => () => this.handleChange(value);

  render () {
    const { label, values } = this.props;
    const { value } = this.state;
    const { handleChange, handleClick } = this;

    return (
      <div className="control-container">
        <p className="control-label">{label}</p>
        <BPSelect
          popoverProps={{ usePortal: false }}
          items={values}
          filterable={values.length > 9}
          itemRenderer={val => <MenuItem onClick={handleClick(val)} key={val} text={val} />}
          noResults={<MenuItem disabled text="No results." />}
          onItemSelect={handleChange}
        >
          <Button text={value} rightIcon="double-caret-vertical" />
        </BPSelect>
      </div>
    );
  }
}

export default Select;
