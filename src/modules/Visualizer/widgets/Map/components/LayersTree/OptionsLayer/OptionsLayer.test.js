import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import OptionsLayer from '.';

jest.mock('@blueprintjs/core', () => {
  function Slider () { return null; }
  return {
    Slider,
    Elevation: { TWO: 2 },
  };
});
it('should render correctly', () => {
  const tree = renderer.create((
    <OptionsLayer
      opacity={0}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should change opacity', () => {
  const onOpacityChange = jest.fn();
  const wrapper = shallow(<OptionsLayer onOpacityChange={onOpacityChange} />);
  wrapper.find('Slider').get(0).props.onChange();
  expect(onOpacityChange).toHaveBeenCalled();
});
