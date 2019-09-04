import {
  Button,
  ControlGroup,
  Icon,
  Popover,
  PopoverPosition,
  Tooltip,
} from '@blueprintjs/core';
import PropTypes from 'prop-types';
import { parse, stringify } from 'query-string';
import React from 'react';
import translateMock from '../../../../../utils/translate';
import { DEFAULT_OPTIONS } from '../../../../State/Hash/withHashState';

import AbstractMapControl from '../../../helpers/AbstractMapControl';
import twitterIcon from './twitter.svg';
import facebookIcon from './facebook.svg';
import linkedinIcon from './linkedin.svg';

import './styles.scss';

export const icon = network => {
  switch (network) {
    case 'twitter':
      return twitterIcon;
    case 'facebook':
      return facebookIcon;
    case 'linkedin':
      return linkedinIcon;
    default:
      return null;
  }
};
export class ShareControl extends AbstractMapControl {
  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-share';

  static propTypes = {
    link: PropTypes.bool,
    twitter: PropTypes.bool,
    facebook: PropTypes.bool,
    linkedin: PropTypes.bool,
    /** Function used to translate wording. Takes key and object of options as parameters */
    translate: PropTypes.func,
  };

  static defaultProps = {
    link: true,
    twitter: true,
    facebook: true,
    linkedin: true,
    translate: translateMock({
      'terralego.map.share_control.link': 'Share your map',
      'terralego.map.share_control.share': 'Share your map on {{context}}',
      'terralego.map.share_control.copied': 'Copied!',
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

  share = network => () => {
    const { url } = this.state;
    const text = encodeURIComponent(url);

    switch (network) {
      case 'twitter':
        return global.open(`https://twitter.com/intent/tweet?url=${text}`);
      case 'facebook':
        return global.open(`https://www.facebook.com/sharer/sharer.php?u=${text}`);
      case 'linkedin':
        return global.open(`https://www.linkedin.com/shareArticle?mini=true&url=${text}`);
      default:
        return null;
    }
  }

  render () {
    const { link, translate } = this.props;
    const { url, copySuccess } = this.state;

    return (
      <Popover
        position={PopoverPosition.LEFT}
        usePortal={false}
      >
        <Tooltip
          content={translate('terralego.map.share_control.link')}
        >
          <button
            className="mapboxgl-ctrl-icon"
            type="button"
            onClick={this.generateHashString}
            aria-label={translate('terralego.map.share_control.link')}
          >
            <Icon icon="share" />
          </button>
        </Tooltip>
        <ControlGroup fill>
          {link && (
            <>
              <input
                className="bp3-input"
                ref={this.inputRef}
                onClick={({ target: { value }, target }) =>
                  target.setSelectionRange(0, value.length)}
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
                {copySuccess && translate('terralego.map.share_control.copied')}
              </Popover>
            </>
          )}
          {['twitter', 'facebook', 'linkedin'].map(network => this.props[network] && (
            <Tooltip
              key={network}
              className={`share__btn share__btn--${network}`}
              content={translate('terralego.map.share_control.share', {
                context: network.charAt(0).toUpperCase() + network.slice(1),
              })}
              openOnTargetFocus={false}
            >
              <Button
                onClick={this.share(network)}
              >
                <img src={icon(network)} alt={network} />
              </Button>
            </Tooltip>
          ))}
        </ControlGroup>
      </Popover>
    );
  }
}

export default ShareControl;
