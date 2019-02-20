import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Text from './Text';

it('should render correctly', () => {
  const tree = renderer.create((
    <Text
      label="Pwout"
      onChange={() => null}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should have default onChange', () => {
  expect(Text.defaultProps.onChange).toBeDefined();
});

it('should default props make something', () => {
  expect(Text.defaultProps.onChange('ah')).toBe(null);
});

it('should mount & update correctly', () => {
  const wrapper = shallow((
    <Text
      label="Pwout"
      onChange={() => null}
    />
  ));

  const pwetText = wrapper.find({ value: '' });
  pwetText.simulate('change', { target: { value: 'ah' } });
  expect(wrapper.instance().state.value).toEqual('ah');
  pwetText.simulate('change', { target: { value: '' } });
  expect(wrapper.instance().state.value).toEqual('');
});
