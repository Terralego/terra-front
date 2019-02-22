import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Checkbox from './Checkbox';

jest.mock('@blueprintjs/core', () => ({
  Checkbox: () => <p>Checkbox</p>,
}));

it('should render correctly', () => {
  const tree = renderer.create((
    <Checkbox
      value="Pwout"
      checked
      onToggle={() => null}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should mount & update correctly', () => {
  const onToggle = jest.fn();
  const value = 'foo';
  const wrapper = shallow((
    <Checkbox
      value={value}
      checked
      onToggle={onToggle}
    />
  ));

  wrapper.instance().onToggle();
  expect(onToggle).toHaveBeenCalledWith(value);
});
