import React from 'react';
import PropTypes from 'prop-types';
import { Callout } from '@blueprintjs/core/lib/cjs/components/callout/callout';
import { Intent } from '@blueprintjs/core/lib/cjs/common/intent';

import Select from '../../../../../Forms/Controls/Select';
import translateMock from '../../../../../../utils/translate';

import './styles.scss';

export class Selector extends React.Component {
  static propTypes = {
    selectors: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })).isRequired,
    })).isRequired,
    layers: PropTypes.arrayOf(PropTypes.shape({
      selectorKey: PropTypes.object,
    })).isRequired,
    activeLayer: PropTypes.shape({
      selectorKey: PropTypes.object,
    }).isRequired,
    onChange: PropTypes.func,
    translate: PropTypes.func,
  }

  static defaultProps = {
    onChange () {},
    translate: translateMock({
      'terralego.visualizer.layerstree.group.selector': 'No layer found',
    }),
  }

  state = {}

  onChange = name => value => {
    const { selectors, layers, activeLayer: { selectorKey }, onChange } = this.props;
    const newKey = { ...selectorKey, [name]: value };
    const newActiveLayerIndex = layers.findIndex(({ selectorKey: layerSelectorKey }) =>
      Object.keys(layerSelectorKey).length === selectors.length &&
      selectors.reduce((prev, { name: selectorName }) =>
        prev && layerSelectorKey[selectorName] === newKey[selectorName],
      true));
    if (newActiveLayerIndex === -1) {
      return this.setState({ noMatchingLayer: true });
    }
    this.setState({ noMatchingLayer: false });
    return onChange(newActiveLayerIndex);
  }

  render () {
    const { selectors, activeLayer: { selectorKey }, translate } = this.props;
    const { noMatchingLayer } = this.state;

    return (
      <div className="selector">
        {selectors.map(({ label, name, values }) => (
          <Select
            fullWidth
            key={name}
            label={label}
            className="selector__select"
            onChange={this.onChange(name)}
            values={values}
            value={values.find(({ value }) => selectorKey[name] === value)}
          />
        ))}
        {noMatchingLayer && (
          <Callout intent={Intent.WARNING} className="selector__message">
            {translate('visualizer.layerstree.group.selector')}
          </Callout>
        )}
      </div>
    );
  }
}

export default Selector;
