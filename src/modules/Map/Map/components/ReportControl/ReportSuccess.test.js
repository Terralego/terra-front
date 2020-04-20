import React from 'react';
import renderer from 'react-test-renderer';

import ReportSuccess from './ReportSuccess';

it('should render correctly', () => {
  const tree = renderer.create(
    <ReportSuccess translate={m => m} />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
