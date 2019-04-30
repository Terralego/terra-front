import React from 'react';
import PropTypes from 'prop-types';
import { Radio, RadioGroup, Icon, Popover } from '@blueprintjs/core';

import AbstractMapControl from '../../../helpers/AbstractMapControl';
import './styles.scss';

export class BackgroundStyles extends AbstractMapControl {
  static propTypes = {
    styles: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
      PropTypes.string,
    ]).isRequired,
    selected: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-background-styles';

  onChange = ({ target: { value } }) => {
    const { onChange } = this.props;
    onChange(value);
  }

  render () {
    const { styles, selected } = this.props;
    const { onChange } = this;

    return (
      <button
        className="mapboxgl-ctrl-icon"
        type="button"
      >
        <Popover
          className="popoverPos"
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
          <Icon icon="layers" />
        </Popover>
      </button>
    );
  }
}

export default BackgroundStyles;
