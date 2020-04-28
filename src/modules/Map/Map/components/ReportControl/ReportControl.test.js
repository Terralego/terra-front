import React from 'react';
import renderer from 'react-test-renderer';

import ReportControl from './ReportControl';

jest.mock('react-dom', () => ({
  createPortal: () => <div>Blueprint3.Overlay</div>, // fix usePortal error of Blueprint overlay
  render: jest.fn(),
}));

jest.mock('mapbox-gl', () => ({
  Marker: () => ({}),
}));

it('should render correctly', () => {
  const tree = renderer.create(
    <ReportControl
      translate={jest.fn()}
      reportCoords={{ lat: '44,4', lng: '4.55' }}
    />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should render correctly when reporting', () => {
  const component = renderer.create(
    <ReportControl
      translate={jest.fn()}
      reportCoords={{ lat: '44,4', lng: '4.55' }}
    />,
  );
  component.getInstance().setState({ isReporting: true });
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('should add eventlistener on map when toggling report', () => {
  const mockedMap = { on: jest.fn() };
  const component = renderer.create(
    <ReportControl
      translate={jest.fn()}
      map={mockedMap}
      reportCoords={{ lat: '44,4', lng: '4.55' }}
    />,
  );
  const instance = component.getInstance();
  instance.displayToaster = jest.fn();
  instance.onToggleReport();
  expect(mockedMap.on).toHaveBeenCalled();
});

it('should remove eventlistener and marker on map when stopping report', () => {
  const mockedMap = { off: jest.fn() };
  const mockedMarker = { remove: jest.fn() };
  const component = renderer.create(
    <ReportControl
      translate={jest.fn()}
      map={mockedMap}
      reportCoords={{ lat: '44,4', lng: '4.55' }}
    />,
  );
  // mock this.marker.remove()
  // marker is removed when reporting is stopped
  component.getInstance().marker = mockedMarker;
  component.getInstance().onStopReport();
  expect(mockedMap.off).toHaveBeenCalled();
  expect(mockedMarker.remove).toHaveBeenCalled();
});

it('should stop report and toggle a new one when asking new report', () => {
  const mockedStopReport = jest.fn();
  const mockedToggleReport = jest.fn();
  const component = renderer.create(
    <ReportControl
      translate={jest.fn()}
      map={{ on: jest.fn(), off: jest.fn() }}
      reportCoords={{ lat: '44,4', lng: '4.55' }}
    />,
  );
  const instance = component.getInstance();
  instance.marker = { remove: jest.fn() };
  instance.onStopReport = mockedStopReport;
  instance.onToggleReport = mockedToggleReport;
  instance.onNewReport();
  expect(mockedStopReport).toHaveBeenCalled();
  expect(mockedToggleReport).toHaveBeenCalled();
});
