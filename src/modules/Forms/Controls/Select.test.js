import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';

import Select from './Select';

jest.mock('@blueprintjs/select', () => ({
  Select: function BPSelect ({ children }) { return children; },
}));
jest.mock('@blueprintjs/core', () => ({
  Button () { return null; },
  MenuItem: function BPMenuItem () { return null; },
}));

it('should render correctly', () => {
  const tree = renderer.create((
    <Select
      label="Pwout"
      onChange={() => null}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should mount & update correctly', () => {
  const onChange = jest.fn();
  const wrapper = shallow((
    <Select
      label="Pwout"
      onChange={onChange}
      values={['pwet', 'wxd']}
    />
  ));

  wrapper.instance().handleChange('pwout');
  expect(onChange).toHaveBeenCalled();
  jest.clearAllMocks();
  wrapper.instance().handleClick('pwit')();
  expect(onChange).toHaveBeenCalled();
});

it('should render an item', () => {
  const onChange = jest.fn();
  const wrapper = mount((
    <Select
      label="Pwout"
      values={['pwet', 'wxd']}
      onChange={onChange}
    />
  ));

  const { itemRenderer } = wrapper.find('BPSelect').props();
  const ItemRenderer = () => itemRenderer('foo');
  const itemWrapper = shallow(<ItemRenderer />);
  expect(itemWrapper.find('BPMenuItem').length).toBe(1);
  const { onClick } = itemWrapper.find('BPMenuItem').props();
  onClick();
  expect(onChange).toHaveBeenCalledWith('foo');
});
