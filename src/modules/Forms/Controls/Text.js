import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup } from '@blueprintjs/core';

import './index.scss';

export class Text extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
  }

  static defaultProps = {
    label: '',
    onChange () {},
    value: '',
  }

  handleChange = ({ target: { value } }) => {
    const { onChange } = this.props;
    onChange(value);
  }

  render () {
    const { label, value } = this.props;
    const { handleChange } = this;

    return (
      <div className="control-container">
        <p className="control-label">{label}</p>
        <InputGroup
          onChange={handleChange}
          value={value}
        />
      </div>
    );
  }
}

export default Text;
