import React from 'react';
import renderer from 'react-test-renderer';
import SignupFormRenderer from './SignupFormRenderer';

it('should render correctly', () => {
  const tree = renderer
    .create(<SignupFormRenderer />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
