import React from 'react';
import renderer from 'react-test-renderer';

import LoginFormRenderer from './LoginFormRenderer';

it('should render correctly', () => {
  const tree = renderer
    .create(
      <>
        <LoginFormRenderer />
        <LoginFormRenderer
          errorGeneric
        />
      </>,
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
