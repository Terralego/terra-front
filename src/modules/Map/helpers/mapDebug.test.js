/* eslint-disable no-console */
import mapBoxGl from 'mapbox-gl';
import MapboxInspect from 'mapbox-gl-inspect';
import renderInspectPopup from 'mapbox-gl-inspect/lib/renderPopup';
import { addMapDebug } from './mapDebug';

jest.mock('mapbox-gl', () => {
  const mockedPopup = { on: jest.fn() };

  return {
    mockedPopup,
    Popup: jest.fn(() => mockedPopup),
  };
});

jest.mock('mapbox-gl-inspect/lib/renderPopup', () => jest.fn());

jest.mock('mapbox-gl-inspect', () => {
  const mockedControl = {};
  const mockedMapboxInspector = jest.fn(() => mockedControl);
  mockedMapboxInspector.mockedControl = mockedControl;

  return mockedMapboxInspector;
});

jest.spyOn(global.console, 'log');

beforeEach(() => {
  MapboxInspect.mockClear();
  mapBoxGl.mockedPopup.on.mockClear();
  mapBoxGl.Popup.mockClear();
  renderInspectPopup.mockClear();
  console.log.mockClear();
});

it('should only return map', () => {
  const map = {};
  expect(addMapDebug(map)).toBe(map);
});

describe('should add a Control', () => ['*', 'console', 'popup'].forEach(localStorageValue =>
  it(`with ${localStorageValue} in localStorage`, () => {
    const map = { addControl: jest.fn() };
    global.localStorage.mapDebug = localStorageValue;
    addMapDebug(map);
    expect(map.addControl).toHaveBeenCalledWith(MapboxInspect.mockedControl);
  })));

it('should create a Popup', () => {
  const map = { addControl () {} };
  addMapDebug(map);

  expect(mapBoxGl.Popup).toHaveBeenCalledWith({
    closeButton: false,
    closeOnClick: false,
  });
});

it('should show a popup', () => {
  const map = { addControl () {} };

  global.localStorage.mapDebug = '*';
  addMapDebug(map);
  expect(mapBoxGl.mockedPopup.on).not.toHaveBeenCalled();

  global.localStorage.mapDebug = 'popup';
  addMapDebug(map);
  expect(mapBoxGl.mockedPopup.on).not.toHaveBeenCalled();
});

it('should not show a popup (popup show but autodestroy)', () => {
  const map = { addControl () {} };

  global.localStorage.mapDebug = 'console';
  addMapDebug(map);

  expect(mapBoxGl.mockedPopup.on).toHaveBeenCalled();
  const [[event, callback]] = mapBoxGl.mockedPopup.on.mock.calls;
  const target = { remove: jest.fn() };
  callback({ target });

  expect(target.remove).toHaveBeenCalled();
  expect(event).toBe('open');
});


it('should create a new mapboxInspect', () => {
  const map = { addControl () {} };

  global.localStorage.mapDebug = '*';
  addMapDebug(map);

  expect(MapboxInspect).toHaveBeenCalled();
  const [[{
    popup, showMapPopup, showMapPopupOnHover, showInspectButton,
    showInspectMap, showInspectMapPopupOnHover,
  }]] = MapboxInspect.mock.calls;

  expect(popup).toBe(mapBoxGl.mockedPopup);
  expect(showMapPopup).toBe(true);
  expect(showMapPopupOnHover).toBe(false);
  expect(showInspectButton).toBe(false);
  expect(showInspectMap).toBe(false);
  expect(showInspectMapPopupOnHover).toBe(false);
});


it('should render the popup', () => {
  const map = { addControl () {} };

  global.localStorage.mapDebug = '*';
  addMapDebug(map);
  const [[{ renderPopup }]] = MapboxInspect.mock.calls;
  const features = [];

  renderPopup(features);
  expect(renderInspectPopup).toHaveBeenCalledWith(features);
  expect(console.log).toHaveBeenCalledWith(features);
});

it('should render the popup with no console', () => {
  const map = { addControl () {} };

  global.localStorage.mapDebug = 'popup';
  addMapDebug(map);
  const [[{ renderPopup }]] = MapboxInspect.mock.calls;
  const features = [];

  renderPopup(features);
  expect(console.log).not.toHaveBeenCalled();
});
