import React from 'react';
import renderer from 'react-test-renderer';

import { WarningZoom } from './WarningZoom';

jest.mock('@blueprintjs/core', () => ({
  Intent: {
    PRIMARY: 'primary',
  },
  Tooltip ({ children }) { return children; },
}));

it('should render with warning', () => {
  const tree = renderer.create((
    <WarningZoom
      display
      isActive
      minZoomLayer={14}
    >
      <p>foo</p>
    </WarningZoom>
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render without warning', () => {
  const tree = renderer.create((
    <WarningZoom
      display={false}
      isActive={false}
      minZoomLayer={14}
    >
      <p>foo</p>
    </WarningZoom>
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});
