import React from 'react';
import renderer from 'react-test-renderer';

import ReportCard from './ReportCard';

jest.mock('@blueprintjs/core', () => ({
  Overlay: ({ children }) => <div id="overlay">{children}</div>,
  Card: ({ children }) => <div id="card">{children}</div>,
  Elevation: () => ({ FOUR: 'four' }),
}));
jest.mock('./ReportForm', () => () => 'reportform');
jest.mock('./ReportSuccess', () => () => 'reportsuccess');

it('should render correctly', () => {
  const tree = renderer.create(
    <ReportCard
      isOpen
      reportUrl="report/url/"
      translate={jest.fn()}
      cancelReport={jest.fn()}
      onSubmit={jest.fn()}
    />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
