import React from 'react';
import PropTypes from 'prop-types';
import { Radio, RadioGroup, Button, Icon, Popover } from '@blueprintjs/core';

import './styles.scss';

export class BackgroundStyles extends React.Component {
  static propTypes = {
    styles: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
      PropTypes.string,
    ]).isRequired,
    selected: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

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
                <Radio
                  className="bgLayer-radio"
                  key={`${label}${url}`}
                  label={label}
                  value={url}
                />
              ))}
            </RadioGroup>
          </div>
        )}
      >
        <Button onClick={toggleSelector}>
          {<Icon icon="layers" />}
        </Button>
      </Popover>
    );
  }
}

export default BackgroundStyles;
