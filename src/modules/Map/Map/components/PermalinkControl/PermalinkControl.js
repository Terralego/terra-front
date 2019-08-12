import { Icon, Popover, PopoverPosition, Button } from '@blueprintjs/core';
import * as PropTypes from 'prop-types';
import { stringify } from 'query-string';
import React from 'react';
import translateMock from '../../../../../utils/translate';
import { DEFAULT_OPTIONS } from '../../../../State/Hash/withHashState';

import AbstractMapControl from '../../../helpers/AbstractMapControl';


export class PermalinkControl extends AbstractMapControl {
  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-permalink';

  static propTypes = {
    /** Function used to translate wording. Takes key and object of options as parameters */
    translate: PropTypes.func,
  };

  static defaultProps = {
    translate: translateMock({
      'terralego.map.permalink_control.button_label': 'Get permalink',
    }),
  };

  state = {};

  inputRef = React.createRef();

  options = DEFAULT_OPTIONS;

  generateHashString = () => {
    const { initialState } = this.props;
    const [currentUrl] = window.location.href.split('#');
    const url = `${currentUrl}#${stringify(initialState, this.options)}`;
    this.setState({ url });
  };

  render () {
    const { translate } = this.props;
    const { url, copySuccess } = this.state;
    return (
      <Popover position={PopoverPosition.LEFT}>
        <button
          className="mapboxgl-ctrl-icon"
          type="button"
          onClick={() => this.generateHashString()}
          title={translate('terralego.map.capture_control.button_label')}
          aria-label={translate('terralego.map.capture_control.button_label')}
        >
          <Icon icon="link" />
        </button>
        <>
          <input
            className="bp3-input"
            ref={this.inputRef}
            onClick={({ target: { value }, target }) => target.setSelectionRange(0, value.length)}
            value={url}
            readOnly
            size={80}
          />
          <Popover>
            <Button
              onClick={() => {
                const { current: textInput } = this.inputRef;
                textInput.setSelectionRange(0, textInput.value.length);
                document.execCommand('copy');
                this.setState({ copySuccess: true });
                setTimeout(() => this.setState({ copySuccess: false }), 2000);
              }}
              intent={copySuccess ? 'success' : 'none'}
              icon="clipboard"
            />
            {copySuccess && 'Copied !'}
          </Popover>
        </>
      </Popover>
    );
  }
}

export default PermalinkControl;
