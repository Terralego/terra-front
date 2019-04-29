import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Radio, RadioGroup, Button, Icon, Popover } from '@blueprintjs/core';

import './styles.scss';

export class BackgroundStyles extends React.Component {
  static propTypes = {
    styles: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })).isRequired,
    selected: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  state = {
    showRadioGroup: false,
  }

  onAdd (map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-search';
    ReactDOM.render(
      <BackgroundStyles
        container={this.container}
        {...this.props}
      />,
      this.container,
    );
    return this.container;
  }

  onRemove () {
    this.container.parentNode.removeChild(this.container);
    delete this.map;
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
