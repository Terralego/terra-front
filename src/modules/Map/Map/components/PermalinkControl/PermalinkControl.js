import {
  Button,
  ControlGroup,
  Icon,
  Popover,
  PopoverPosition,
} from '@blueprintjs/core';
import PropTypes from 'prop-types';
import { parse, stringify } from 'query-string';
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

  /**
   * Generate an url with current state (aware of current map hash)
   *
   * @return {string}
   */
  generateHashString = () => {
    const { hash, initialState } = this.props;
    const [currentUrl, currentHash] = window.location.href.split('#');
    if (typeof hash === 'string') {
      initialState[hash] = parse(currentHash)[hash];
    }
    const url = `${currentUrl}#${stringify(initialState, this.options)}`;
    this.setState({ url });
  };

  copyToCliboard = () => {
    const { current: textInput } = this.inputRef;
    textInput.setSelectionRange(0, textInput.value.length);
    textInput.focus();
    document.execCommand('copy');
    this.setState({ copySuccess: true });
    setTimeout(() => this.setState({ copySuccess: false }), 2000);
  };

  render () {
    const { translate } = this.props;
    const { url, copySuccess } = this.state;
    return (
      <Popover position={PopoverPosition.LEFT} usePortal={false}>
        <button
          className="mapboxgl-ctrl-icon"
          type="button"
          onClick={this.generateHashString}
          title={translate('terralego.map.capture_control.button_label')}
          aria-label={translate('terralego.map.capture_control.button_label')}
        >
          <Icon icon="link" />
        </button>
        <ControlGroup fill>
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
              onClick={this.copyToCliboard}
              intent={copySuccess ? 'success' : 'none'}
              icon="clipboard"
            />
            {copySuccess && 'Copied !'}
          </Popover>
        </ControlGroup>
      </Popover>
    );
  }
}

export default PermalinkControl;
