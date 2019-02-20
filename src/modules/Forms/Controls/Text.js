import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup } from '@blueprintjs/core';

import './index.scss';

export class Text extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    label: '',
    onChange: () => null,
  }

  state = {
    value: '',
  }

  handleChange = ({ target: { value } }) => {
    const { onChange } = this.props;
    this.setState({ value });
    onChange(value);
  }

  render () {
    const { label } = this.props;
    const { value } = this.state;
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
