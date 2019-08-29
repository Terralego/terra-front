import {
  displayWarningAccordingToZoom,
} from './warningZoom';

const getStyle = jest.fn(() => ({
  layers: [{
    id: 'foo',
    source: 'foo',
    type: 'fill',
    minzoom: 14,
    maxzoom: 22,
    paint: {
      'fill-opacity': 1,
    },
  }],
}));
it('should display warning according to current zoom', () => {
  const map = {
    getZoom: jest.fn(() => 7),
    getSource: jest.fn(() => ({ minzoom: 14, maxzoom: 22 })),
    getLayer: jest.fn(id => ({
      id,
      minzoom: 14,
      maxzoom: 24,
    })),
    getStyle,
  };
  const layer = { layers: ['foo'] };
  expect(displayWarningAccordingToZoom(map, layer)).toEqual({ display: true, minZoomLayer: 14 });
});

it('should not display warning according to current zoom', () => {
  const map = {
    getZoom: jest.fn(() => 17),
    getSource: jest.fn(() => ({ minzoom: 14, maxzoom: 22 })),
    getLayer: jest.fn(id => ({
      id,
      minzoom: 14,
      maxzoom: 24,
    })),
    getStyle,
  };
  const layer = { layers: ['foo'] };
  expect(displayWarningAccordingToZoom(map, layer)).toEqual({ display: false, minZoomLayer: 14 });

  map.getLayer = jest.fn(id => ({
    id,
  }));
  expect(displayWarningAccordingToZoom(map, layer)).toEqual({ display: false, minZoomLayer: 0 });

  map.getLayer = jest.fn(() => null);
  expect(displayWarningAccordingToZoom(map, layer)).toEqual({ display: false, minZoomLayer: 0 });
});

it('should displayWarningAccordingToZoom without map', () => {
  const map = undefined;
  const layer = { layers: ['foo'] };
  expect(displayWarningAccordingToZoom(map, layer)).toEqual({});
});
