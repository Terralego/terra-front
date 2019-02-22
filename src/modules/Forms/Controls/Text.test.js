import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Text from './Text';

it('should render correctly', () => {
  const tree = renderer.create((
    <Text
      label="Pwout"
      onChange={() => null}
      value=""
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should mount & update correctly', () => {
  const onChange = jest.fn();
  const wrapper = shallow((
    <Text
      label="Pwout"
      onChange={onChange}
      value=""
    />
  ));

  const pwetText = wrapper.find({ value: '' });
  pwetText.simulate('change', ({ target: { value: 'pwet' } }));
  expect(onChange).toHaveBeenCalled();
});
