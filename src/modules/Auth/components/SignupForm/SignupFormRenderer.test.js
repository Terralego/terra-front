import React from 'react';
import renderer from 'react-test-renderer';
import SignupFormRenderer from './SignupFormRenderer';

it('should render correctly', () => {
  const tree = renderer
    .create(<SignupFormRenderer />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('should render with errors', () => {
  const tree = renderer
    .create(<SignupFormRenderer errors={{ email: true, password: true }} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
