import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import PrintControl from './PrintControl';

let prevPrint;
beforeEach(() => {
  prevPrint = global.print;
  global.print = jest.fn();
});

afterEach(() => {
  global.print = prevPrint;
});

it('should render', () => {
  const tree = renderer.create(<PrintControl />);
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should print', () => {
  const wrapper = shallow(<PrintControl />);

  wrapper.find('button').props().onClick();
  expect(global.print).toHaveBeenCalled();
});
