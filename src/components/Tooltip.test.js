import React from 'react';
import renderer from 'react-test-renderer';

import { Button } from '@blueprintjs/core';
import Tooltip from './Tooltip';

jest.mock('@blueprintjs/core', () => ({
  Button: () => <p>Button</p>,
}));

it('should render with desktop device size', () => {
  const props = { content: 'foo' };
  const tree = renderer.create((
    <Tooltip
      isMobileSized={false}
      {...props}
    >
      <Button />
    </Tooltip>
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render with tablet device size', () => {
  const tree = renderer.create((
    <Tooltip
      isMobileSized
    >
      <Button />
    </Tooltip>
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});
