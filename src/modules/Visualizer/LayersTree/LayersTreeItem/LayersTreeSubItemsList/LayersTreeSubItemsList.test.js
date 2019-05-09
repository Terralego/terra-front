import React from 'react';
import renderer from 'react-test-renderer';

import LayersTreeSubItemsList from './LayersTreeSubItemsList';

jest.mock('@blueprintjs/core', () => ({
  RadioGroup ({ children }) {
    return children;
  },
  Radio () {
    return <p>Radio</p>;
  },
}));

it('should render correctly', () => {
  const layer = {
    label: 'layer',
    sublayers: [{
      label: 'sublayer1',
    }, {
      label: 'sublayer2',
    }],
  };
  const tree = renderer.create((
    <>
      <LayersTreeSubItemsList
        layer={layer}
        sublayers={layer.sublayers}
        layerState={{
          sublayers: [true, false],
        }}
      />
    </>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should change selection', () => {
  const layer = {
    label: 'layer',
    sublayers: [{
      label: 'sublayer1',
    }, {
      label: 'sublayer2',
    }],
  };
  const selectSublayer = jest.fn();
  const instance = new LayersTreeSubItemsList({
    layer,
    sublayers: layer.sublayers,
    layerState: { sublayers: [true, false] },
    selectSublayer,
  });
  instance.onSelectionChange({ target: { value: 1 } });
  expect(selectSublayer).toHaveBeenCalledWith({
    layer, sublayer: 1,
  });
});
