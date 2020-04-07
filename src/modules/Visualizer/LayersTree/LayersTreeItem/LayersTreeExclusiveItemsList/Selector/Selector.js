import React from 'react';
import PropTypes from 'prop-types';
import { Callout } from '@blueprintjs/core/lib/cjs/components/callout/callout';
import { Intent } from '@blueprintjs/core/lib/cjs/common/intent';

import Select from '../../../../../Forms/Controls/Select';
import translateMock from '../../../../../../utils/translate';

import './styles.scss';

const SelectorSelect = ({
  label,
  name,
  values,
  currentValue,
  onChange,
  ...props
}) => {
  const handleChange = React.useCallback(
    value => onChange(name, value),
    [name, onChange],
  );

  /**
   * Get selected value from all values.
   */
  const getSelectedValue = React.useMemo(() => {
    if (values.length) {
      const { value } = values.find(({ value: listValue }) =>
        currentValue === listValue) || values[0];
      return value;
    }
    return null;
  }, [currentValue, values]);

  return (
    <Select
      fullWidth
      label={label}
      className="selector__select"
      onChange={handleChange}
      values={values}
      value={getSelectedValue}
      {...props}
    />
  );
};


export const Selector = ({
  selectors,
  layers,
  activeLayer: { selectorKey = {} } = {},
  onChange,
  translate,
}) => {
  const [noMatchingLayer, setNoMatchingLayer] = React.useState(false);

  const getLayerForSelector = React.useCallback(currentSelectorKey =>
    layers.findIndex(({ selectorKey: layerSelectorKey }) =>
      Object.keys(layerSelectorKey).length === selectors.length &&
      selectors.every(({ name: selectorName }) =>
        layerSelectorKey[selectorName] === currentSelectorKey[selectorName])),
  [layers, selectors]);

  const handleChange = React.useCallback((name, value) => {
    const newKey = { ...selectorKey, [name]: value };

    const newActiveLayerIndex = getLayerForSelector(newKey);

    if (newActiveLayerIndex === -1) {
      setNoMatchingLayer(true);
      return;
    }

    setNoMatchingLayer(false);
    onChange(newActiveLayerIndex);
  }, [getLayerForSelector, onChange, selectorKey]);

  React.useEffect(() => {
    const activeLayerIndex = getLayerForSelector(selectorKey);
    setNoMatchingLayer(activeLayerIndex === -1);
  }, [getLayerForSelector, selectorKey]);

  return (
    <div className="selector">
      {selectors.map(({ label, name, values }) => (
        <SelectorSelect
          key={name}
          name={name}
          label={label}
          onChange={handleChange}
          values={values}
          currentValue={selectorKey[name]}
        />
      ))}
      {noMatchingLayer && (
      <Callout intent={Intent.WARNING} className="selector__message">
        {translate('terralego.visualizer.layerstree.group.selector')}
      </Callout>
      )}
    </div>
  );
};

Selector.propTypes = {
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
};

Selector.defaultProps = {
  onChange () {},
  translate: translateMock({
    'terralego.visualizer.layerstree.group.selector': 'No layer found',
  }),
};

export default Selector;
