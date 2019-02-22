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
