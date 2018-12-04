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
  const instance = wrapper.instance();
  instance.generateWidgets = jest.fn();
  wrapper.setProps({
    widgets: [{ type: 'map' }],
  });
  expect(instance.generateWidgets).toHaveBeenCalled();
});

it('should close details', () => {
  const setDetails = jest.fn();
  const instance = new View({ setDetails }, {});
  instance.closeDetails();
  expect(setDetails).toHaveBeenCalledWith(null);
});

it('should throw with invalid widget name', () => {
  class ViewWithoutProptypes {
    constructor (props) {
      this.props = props;
      this.generateWidgets = View.prototype.generateWidgets.bind(this);
    }
  }
  const instance = new ViewWithoutProptypes({ widgets: [{ type: 'foo' }] }, {});
  expect(() => instance.generateWidgets()).toThrow('Invalid widget type');
});
