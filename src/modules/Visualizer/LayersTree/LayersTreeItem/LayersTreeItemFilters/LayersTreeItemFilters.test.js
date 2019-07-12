import React from 'react';
import renderer from 'react-test-renderer';

import LayersTreeItemFilters, { getValueFromType } from './LayersTreeItemFilters';

let toLocaleDateString;
beforeEach(() => {
  // eslint-disable-next-line prefer-destructuring
  toLocaleDateString = Date.prototype.toLocaleDateString;
  // eslint-disable-next-line no-extend-native
  Date.prototype.toLocaleDateString = () => 'mocked date';
});
afterEach(() => {
  // eslint-disable-next-line no-extend-native
  Date.prototype.toLocaleDateString = toLocaleDateString;
});

it('should render', () => {
  const tree = renderer.create(
    <>
      <LayersTreeItemFilters
        filtersValues={{
          single: 'foo',
          many: ['foo', 'bar'],
          range: [2, 42],
          date: [new Date(), new Date(+new Date() + 1000000)],
          bool: true,
        }}
        layer={{
          filters: {
            form: [{
              type: 'single',
              property: 'single',
            }, {
              type: 'many',
              property: 'many',
              values: ['foo', 'bar', 'lorem'],
            }, {
              type: 'range',
              property: 'range',
            }, {
              type: 'range',
              property: 'date',
              format: 'date',
            }, {
              type: 'boolean',
              property: 'bool',
            }],
          },
        }}
      />
      <LayersTreeItemFilters
        activeLayer={{}}
      />
    </>,
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should remove tag', () => {
  const layer = {
    filters: {
      form: [{
        type: 'single',
        property: 'single',
      }],
    },
  };
  const setLayerState = jest.fn();
  const tree = renderer.create(
    <LayersTreeItemFilters
      setLayerState={setLayerState}
      filtersValues={{
        single: 'foo',
      }}
      layer={layer}
    />,
  );
  const tag = tree.root.find(({ type: { displayName } }) => displayName === 'Blueprint3.Tag');
  tag.props.onRemove();
  expect(setLayerState).toHaveBeenCalledWith({
    layer,
    state: {
      filters: {},
    },
    total: undefined,
  });
});

it('should return no value', () => {
  getValueFromType(true, 'boolean');
  expect(getValueFromType(true, 'boolean')).toEqual(null);
});
