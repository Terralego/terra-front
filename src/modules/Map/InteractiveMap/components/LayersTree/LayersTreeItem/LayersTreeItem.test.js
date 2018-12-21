import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import LayersTreeItem from './LayersTreeItem';

jest.mock('@blueprintjs/core', () => ({
  Button () {
    return <p>Button</p>;
  },
  Card ({ children }) {
    return children;
  },
  Switch () {
    return <p>Switch</p>;
  },
  Elevation: {
    TWO: 'two',
  },
}));

jest.mock('../OptionsLayer', () => function OptionsLayer () {
  return <p>OptionsLayer</p>;
});
jest.mock('../LayersTreeSubItemsList', () => function LayersTreeSubItemsList () {
  return <p>LayersTreeSubItemsList</p>;
});

it('should render correctly', () => {
  const tree = renderer.create((
    <>
      <LayersTreeItem
        layer={{
          label: 'foo',
        }}
        isActive
        opacity={1}
      />
      <LayersTreeItem
        layer={{
          label: 'bar',
        }}
        opacity={0.3}
      />
      <LayersTreeItem
        layer={{
          label: 'sublayers',
          sublayers: [{
            label: 'sublayer 1',
          }, {
            label: 'sublayer 2',
          }],
        }}
        isActive
        opacity={1}
      />
    </>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should change active state', () => {
  const layer = {};
  const setLayerState = jest.fn();
  const instance = new LayersTreeItem({
    layer,
    setLayerState,
  });
  instance.onActiveChange({
    target: {
      checked: true,
    },
  });
  expect(setLayerState).toHaveBeenCalledWith({
    layer,
    state: { active: true },
  });
  setLayerState.mockClear();

  instance.onActiveChange({
    target: {
      checked: false,
    },
  });
  expect(setLayerState).toHaveBeenCalledWith({
    layer,
    state: { active: false },
  });
});

it('should change opacity state', () => {
  const layer = {};
  const setLayerState = jest.fn();
  const instance = new LayersTreeItem({
    layer,
    setLayerState,
  });
  instance.onOpacityChange(42);
  expect(setLayerState).toHaveBeenCalledWith({
    layer,
    state: { opacity: 42 },
  });
});

it('should open options panel', () => {
  const instance = new LayersTreeItem({});
  instance.setState = jest.fn();

  instance.state = {
    isOptionsOpen: false,
  };
  instance.handleOptionPanel();
  expect(instance.setState).toHaveBeenCalledWith({
    isOptionsOpen: true,
  });
  instance.setState.mockClear();

  instance.state = {
    isOptionsOpen: true,
  };
  instance.handleOptionPanel();
  expect(instance.setState).toHaveBeenCalledWith({
    isOptionsOpen: false,
  });
});

it('should display options panel', () => {
  const wrapper = shallow((
    <LayersTreeItem
      layer={{
        label: 'foo',
      }}
      isActive
    />
  ));
  expect(wrapper.find('OptionsLayer').length).toBe(0);
  wrapper.setState({ isOptionsOpen: true });
  expect(wrapper.find('OptionsLayer').length).toBe(1);
});
