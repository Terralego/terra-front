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
  const wrapper = shallow((
    <WidgetMap
      layersTree={layersTree}
    />
  ));

  const instance = wrapper.instance();
  instance.onChange(layersTree[0].active);
  expect(wrapper.state().stylesToApply).toEqual({
    layouts: [{
      id: 'foo',
      visibility: 'visible',
    }],
  });

  instance.onChange(layersTree[1].active);
  expect(wrapper.state().stylesToApply).toEqual({
    layouts: [{
      id: 'bar',
      visibility: 'visible',
    }],
  });

  instance.onChange(layersTree[0].inactive);
  expect(wrapper.state().stylesToApply).toEqual({
    layouts: [{
      id: 'foo',
      visibility: 'none',
    }],
  });
});
