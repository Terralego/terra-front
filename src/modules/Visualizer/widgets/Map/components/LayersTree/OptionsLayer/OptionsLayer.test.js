import React from 'react';
import renderer from 'react-test-renderer';
import OptionsLayer from './';

it('should render correctly', () => {
  const tree = renderer.create((
    <OptionsLayer
      opacity={0}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
