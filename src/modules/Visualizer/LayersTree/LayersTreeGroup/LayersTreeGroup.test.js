import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import LayersTreeGroup from './LayersTreeGroup';

jest.mock('@blueprintjs/core', () => ({
  H5 ({ children }) {
    return children;
  },
  Button () {
    return <p>Button</p>;
  },
  Collapse ({ children }) {
    return children;
  },
}));

jest.mock('../LayersTreeItem', () => function LayersTreeItem () {
  return <p>LayersTreeItem</p>;
});

it('should render correctly', () => {
  const tree = renderer.create((
    <>
      <LayersTreeGroup
        title="Group 1"
        layer={{
          layers: [{
            label: 'Layer 1',
          }, {
            label: 'Layer 2',
          }],
        }}
      />
      <LayersTreeGroup
        title="Group 1"
        layer={{
          initialState: {
            open: false,
          },
          layers: [{
            label: 'Layer 1',
          }, {
            label: 'Layer 2',
          }],
        }}
      />
      <LayersTreeGroup
        title="Group 1"
        layer={{
          layers: [{
            label: 'Layer 1',
          }, {
            label: 'Layer 2',
          }],
        }}
        isHidden
      />
      <LayersTreeGroup
        title="Group 1"
        layer={{
          layers: [{
            label: 'Layer 1',
          }, {
            group: 'Group 2',
            layers: [],
          }, {
            group: 'Group 3',
            layers: [],
            exclusive: true,
          }],
        }}
      />
    </>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should change layers group state', () => {
  const wrapper = shallow((
    <LayersTreeGroup
      title="Group 1"
      layer={{
        initialState: {
          open: false,
        },
        layers: [{
          label: 'Layer 1',
        }, {
          label: 'Layer 2',
        }],
      }}
    />
  ));
  expect(wrapper.instance().state.open).toEqual(false);
  wrapper.setState({
    open: true,
  });
  expect(wrapper.state().open).toEqual(true);
});

it('should open group panel', () => {
  const instance = new LayersTreeGroup({
    layer: [{
      label: 'Layer 1',
      initialState: {
        open: true,
      },
    }],
  });
  instance.setState = jest.fn();

  instance.state = {
    open: true,
  };
  instance.handleClick();
  expect(instance.setState).toHaveBeenCalledWith({
    open: false,
  });
  instance.setState.mockClear();

  instance.state = {
    open: false,
  };
  instance.handleClick();
  expect(instance.setState).toHaveBeenCalledWith({
    open: true,
  });
});
