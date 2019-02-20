import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Select from './Select';

jest.mock('@blueprintjs/select', () => ({
  Select: ({ children }) => children,
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

it('should have default onChange', () => {
  expect(Select.defaultProps.onChange).toBeDefined();
});

it('should default props make something', () => {
  expect(Select.defaultProps.onChange('ah')).toBe(null);
});

it('should mount & update correctly', () => {
  const wrapper = shallow((
    <Select
      label="Pwout"
      onChange={() => null}
      values={['pwet', 'wxd']}
    />
  ));

  wrapper.instance().handleChange('pwout');
  expect(wrapper.instance().state.value).toEqual('pwout');
  wrapper.instance().handleClick('pwit')();
  expect(wrapper.instance().state.value).toEqual('pwit');
});
