import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import WidgetMap from './WidgetMap';

jest.mock('./components/Map', () => jest.fn(() => null));

it('should render correctly', () => {
  const tree = renderer.create((
    <WidgetMap
      layersTree={[]}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should merge layouts', () => {
  const layersTree = [{
    label: 'foo',
    active: [{
      id: 'foo',
      visibility: 'visible',
    }],
    inactive: [{
      id: 'foo',
      visibility: 'none',
    }],
  }, {
    label: 'bar',
    active: [{
      id: 'bar',
      visibility: 'visible',
    }],
    inactive: [{
      id: 'bar',
      visibility: 'none',
    }],
  }];
  const wrapper = shallow((
    <WidgetMap
      layersTree={layersTree}
    />
  ));

  const instance = wrapper.instance();
  instance.onChange(layersTree[0].active);
  expect(wrapper.state().layouts).toEqual([{
    id: 'foo',
    visibility: 'visible',
  }]);

  instance.onChange(layersTree[1].active);
  expect(wrapper.state().layouts).toEqual([{
    id: 'bar',
    visibility: 'visible',
  }, {
    id: 'foo',
    visibility: 'visible',
  }]);

  instance.onChange(layersTree[0].inactive);
  expect(wrapper.state().layouts).toEqual([{
    id: 'foo',
    visibility: 'none',
  }, {
    id: 'bar',
    visibility: 'visible',
  }]);
});
