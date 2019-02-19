import React from 'react';
import { InputGroup } from '@blueprintjs/core';

export class Text extends React.Component {
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
      <div>
        <p>{label}</p>
        <InputGroup
          onChange={handleChange}
          value={value}
        />
      </div>
    );
  }
}

export default Text;
