import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import WidgetMap from './WidgetMap';
import log from '../../services/log';

jest.mock('./components/Map', () => jest.fn(() => null));
jest.mock('../../services/log', () => jest.fn());

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

it('should interact on click event', () => {
  const instance = new WidgetMap({
    interactions: [{
      id: 'foo',
      interaction: 'displayDetails',
    }, {
      id: 'bar',
      interaction: 'displayTooltip',
    }, {
      id: 'foobar',
      interaction: 'invalid interaction',
    }],
  }, {});
  instance.displayDetails = jest.fn();
  instance.displayTooltip = jest.fn();
  instance.onClick('foo', {}, {});
  expect(instance.displayDetails).toHaveBeenCalled();
  instance.onClick('bar', {}, {});
  expect(instance.displayTooltip).toHaveBeenCalled();
  instance.onClick('foobar', {}, {});
  expect(log).toHaveBeenCalledWith('no interaction found for layer foobar');
  instance.onClick('barfoo', {}, {});
  expect(instance.displayDetails).toHaveBeenCalledTimes(1);
  expect(instance.displayTooltip).toHaveBeenCalledTimes(1);
  expect(log).toHaveBeenCalledTimes(1);
});

it('should display details', () => {
  const setDetails = jest.fn();
  const instance = new WidgetMap({ setDetails }, {});
  const details = {};
  instance.displayDetails(details);
  expect(setDetails).toHaveBeenCalledWith(details);
});

it('should display tooltips', () => {
  const instance = new WidgetMap({}, {});
  instance.setState = jest.fn();
  const event = {
    lngLat: { lng: 1, lat: 2 },
  };
  const template = 'Hello World';
  instance.displayTooltip({ event, template });
  expect(instance.setState).toHaveBeenCalledWith({
    displayTooltip: {
      coordinates: [1, 2],
      content: 'Hello World',
    },
  });
});
