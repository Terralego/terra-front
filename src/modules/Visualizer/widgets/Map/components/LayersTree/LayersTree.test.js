import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { LayersTree } from './LayersTree';


it('should render correctly', () => {
  const layersTree = [{
    label: 'foo',
    active: {
      layouts: [{
        id: 'foo',
        visibility: 'visible',
      }],
    },
    inactive: {
      layouts: [{
        id: 'foo',
        visibility: 'none',
      }],
    },
  }, {
    label: 'bar',
    active: {
      layouts: [{
        id: 'bar',
        visibility: 'visible',
      }],
    },
    inactive: {
      layouts: [{
        id: 'bar',
        visibility: 'none',
      }],
    },
  }];
  const tree = renderer.create((
    <LayersTree
      layersTree={layersTree}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should change on toggle', () => {
  const onChange = jest.fn();
  const layer = {
    active: {},
    inactive: {},
  };
  const wrapper = shallow(<LayersTree onChange={onChange} layersTree={[]} />);
  const instance = wrapper.instance();
  instance.onToggleChange(layer)();
  expect(onChange).toHaveBeenCalledWith(layer.active);
  expect(instance.isActive(layer)).toBe(true);

  instance.onToggleChange(layer)();
  expect(onChange).toHaveBeenCalledWith(layer.inactive);
  expect(instance.isActive(layer)).toBe(false);
});
