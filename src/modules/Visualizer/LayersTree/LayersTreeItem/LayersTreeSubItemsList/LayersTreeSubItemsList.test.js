import React from 'react';
import renderer from 'react-test-renderer';

import LayersTreeSubItemsList from './LayersTreeSubItemsList';


it('should render correctly sublayers list in radioboxes ', () => {
  const layer = {
    label: 'layer',
    sublayers: [{
      label: 'sublayer1', value: 'sublayer1',
    }, {
      label: 'sublayer2',
    }],
  };
  const tree = renderer.create((
    <div>
      <LayersTreeSubItemsList
        layer={layer}
        sublayers={layer.sublayers}
        layerState={{
          sublayers: [true, false],
        }}
      />
    </div>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly sublayers list in select ', () => {
  const layer = {
    label: 'layer',
    sublayers: [{
      label: 'sublayer1', value: 'sublayer1',
    }, {
      label: 'sublayer2', value: 'sublayer2',
    }, {
      label: 'sublayer3', value: 'sublayer3',
    }, {
      label: 'sublayer4', value: 'sublayer4',
    }, {
      label: 'sublayer5', value: 'sublayer5',
    }, {
      label: 'sublayer6', value: 'sublayer6',
    }],
  };
  const tree = renderer.create((
    <div>
      <LayersTreeSubItemsList
        layer={layer}
        sublayers={layer.sublayers}
        layerState={{
          sublayers: [true, false],
        }}
      />
    </div>
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
  const sublayerindex = 0;
  const instance = new LayersTreeSubItemsList({
    layer,
    sublayers: layer.sublayers,
    layerState: { sublayers: [true, false] },
    selectSublayer,
  });
  instance.onSelectionChange(sublayerindex);
  expect(selectSublayer).toHaveBeenCalledWith({
    layer, sublayer: 0,
  });
});
