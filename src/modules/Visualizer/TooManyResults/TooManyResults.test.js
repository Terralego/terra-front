import React from 'react';
import renderer from 'react-test-renderer';

import TooManyResults from './TooManyResults';

jest.mock('../services/search', () => ({
  MAX_SIZE: 100,
}));
it('should render', () => {
  const tree = renderer.create(
    <>
      <TooManyResults
        count={42}
      />
      <TooManyResults
        count={101}
      />
    </>,
  );
  expect(tree.toJSON()).toMatchSnapshot();
});
