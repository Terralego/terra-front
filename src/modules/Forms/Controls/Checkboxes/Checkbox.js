import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as BPCheckbox } from '@blueprintjs/core';

export class Checkbox extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    checked: PropTypes.bool,
    onToggle: PropTypes.func,
  };

  static defaultProps = {
    onToggle () {},
    checked: false,
    value: '',
  };

  onToggle = () => {
    const { onToggle, value } = this.props;
    onToggle(value);
  }

  render () {
    const { value, checked } = this.props;
    const { onToggle } = this;
    return <BPCheckbox onChange={onToggle} label={value} checked={checked} />;
  }
}

export default Checkbox;
