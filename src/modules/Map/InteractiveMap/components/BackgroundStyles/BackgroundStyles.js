import React from 'react';
import PropTypes from 'prop-types';
import { Radio, RadioGroup, Icon, Popover } from '@blueprintjs/core';

import translateMock from '../../../../../utils/translate';
import AbstractMapControl from '../../../helpers/AbstractMapControl';
import Tooltip from '../../../../../components/Tooltip';

import './styles.scss';

export class BackgroundStyles extends AbstractMapControl {
  static propTypes = {
    styles: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
      PropTypes.string,
    ]).isRequired,
    selected: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    translate: PropTypes.func,
  }

  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-background-styles';

  static defaultProps = {
    translate: translateMock({
      'terralego.map.backgroundstyles_control.button_label': 'Background styles',
    }),
  };

  onChange = ({ target: { value } }) => {
    const { onChange } = this.props;
    onChange(value);
  }

  render () {
    const { styles, selected, translate } = this.props;
    const { onChange } = this;

    return (
      <Tooltip
        content={translate('terralego.map.backgroundstyles_control.button_label')}
      >
        <button
          className="mapboxgl-ctrl-icon"
          type="button"
        >
          <Popover
            className="popoverPos"
            content={(
              <div className="radioGroup">
                <RadioGroup
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
      </Tooltip>
    );
  }
}

export default BackgroundStyles;
