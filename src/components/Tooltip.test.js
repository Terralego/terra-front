import React from 'react';
import renderer from 'react-test-renderer';

import Tooltip from './Tooltip';

// mock blueprint tooltip to stabilize tests
jest.mock('@blueprintjs/core', () => ({
  Tooltip: () => <p>Tooltip</p>,
}));

it('should render with desktop device size', () => {
  const props = { content: 'foo' };
  const tree = renderer.create((
    <Tooltip
      isMobileSized={false}
      {...props}
    >
      foo
    </Tooltip>
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render with tablet device size', () => {
  const tree = renderer.create((
    <Tooltip
      isMobileSized
    >
      foo
    </Tooltip>
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});
