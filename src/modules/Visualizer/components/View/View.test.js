import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { View } from './View';

import WidgetMap from '../../widgets/Map';

jest.mock('../../widgets/Map', () => jest.fn(() => null));

it('should render correctly', () => {
  const tree = renderer.create((
    <View
      widgets={[{ type: 'map' }]}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should build widgets', () => {
  const widgets = [{ type: 'map', foo: 'bar' }];
  const wrapper = shallow(<View
    widgets={widgets}
  />);

  const { widgetsComponents } = wrapper.state();
  expect(widgetsComponents.length).toBe(1);
  expect(widgetsComponents[0].Component).toBe(WidgetMap);
  expect(widgetsComponents[0].foo).toBe('bar');
  expect(widgetsComponents[0].key).toBe(0);
});

it('should regenerate widgets components', () => {
  const widgets = [{ type: 'map', foo: 'bar' }];
  const wrapper = shallow(<View
    widgets={widgets}
  />);
  View.prototype.generateWidgets = jest.fn();
  wrapper.setProps({
    widgets: [{ type: 'map' }],
  });
  expect(View.prototype.generateWidgets).toHaveBeenCalled();
});

it('should close details', () => {
  const setDetails = jest.fn();
  const instance = new View({ setDetails }, {});
  instance.closeDetails();
  expect(setDetails).toHaveBeenCalledWith(null);
});
