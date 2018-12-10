import React from 'react';
import { Radio, RadioGroup, Button, Icon, Popover } from '@blueprintjs/core';

import './styles.scss';

export class BackgroundStyles extends React.Component {
  state = {
    showRadioGroup: false,
  }

  toggleSelector = () => {
    const { showRadioGroup } = this.state;
    this.setState({ showRadioGroup: !showRadioGroup });
  }

  onChange = ({ target: { value } }) => {
    const { onChange } = this.props;
    onChange(value);
  }

  render () {
    const { styles, selected } = this.props;
    const { toggleSelector, onChange } = this;

    return (
      <Popover
        className="bp3-dark popoverPos"
        content={(
          <div className="radioGroup">
            <RadioGroup
              label="Fond de carte"
              onChange={onChange}
              selectedValue={selected}
            >
              {styles.map(({ label, url }) => (
                <Radio label={label} value={url} />
              ))}
            </RadioGroup>
          </div>
        )}
      >
        <Button onClick={toggleSelector}>
          {<Icon icon="page-layout" />}
        </Button>
      </Popover>
    );
  }
}

export default BackgroundStyles;
