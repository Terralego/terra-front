import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Switch from './Switch';

it('should render correctly', () => {
  const tree = renderer.create((
    <Switch
      label="Pwout"
      onChange={() => null}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should mount & update correctly', () => {
  const onChange = jest.fn();
  const wrapper = shallow((
    <Switch
      label="Pwout"
      onChange={onChange}
    />
  ));

  const pwetSwitch = wrapper.find({ checked: false });
  pwetSwitch.simulate('change', ({ target: { checked: true } }));
  expect(onChange).toHaveBeenCalledWith(true);
});
