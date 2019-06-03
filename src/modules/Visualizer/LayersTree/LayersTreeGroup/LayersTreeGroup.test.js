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
          layers: [{
            label: 'Layer 1',
          }, {
            label: 'Layer 2',
          }],
        }}
        isHidden
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
        layers: [{
          label: 'Layer 1',
        }, {
          label: 'Layer 2',
        }],
      }}
      isOpen
    />
  ));
  expect(wrapper.state().isOpen).toEqual(true);
  wrapper.setState({
    isOpen: false,
  });
  expect(wrapper.state().isOpen).toEqual(false);
});

it('should open group panel', () => {
  const instance = new LayersTreeGroup({});
  instance.setState = jest.fn();

  instance.state = {
    isOpen: true,
  };
  instance.handleClick();
  expect(instance.setState).toHaveBeenCalledWith({
    isOpen: false,
  });
  instance.setState.mockClear();

  instance.state = {
    isOpen: false,
  };
  instance.handleClick();
  expect(instance.setState).toHaveBeenCalledWith({
    isOpen: true,
  });
});
