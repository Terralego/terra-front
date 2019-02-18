import React from 'react';
import renderer from 'react-test-renderer';

import Tooltip from './Tooltip';

it('should render a tooltip', () => {
  const tree = renderer.create(
    <Tooltip
      properties={{
        foo: 'foo',
      }}
    />,
  );
  expect(tree.toJSON()).toMatchSnapshot();
});
