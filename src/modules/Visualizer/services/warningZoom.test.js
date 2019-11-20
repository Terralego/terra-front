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
  const layer1 = { layers: ['foo'] };
  expect(displayWarningAccordingToZoom(map, layer1)).toEqual({ display: false, minZoomLayer: 14 });

  const layer2 = { layers: ['foo'] };
  map.getLayer = jest.fn(id => ({
    id,
  }));
  expect(displayWarningAccordingToZoom(map, layer2)).toEqual({ display: false, minZoomLayer: 0 });

  const layer3 = { layers: ['foo'] };
  map.getLayer = jest.fn(() => null);
  expect(displayWarningAccordingToZoom(map, layer3)).toEqual({ display: false, minZoomLayer: 0 });
});

it('should displayWarningAccordingToZoom without map', () => {
  const map = undefined;
  const layer = { layers: ['foo'] };
  expect(displayWarningAccordingToZoom(map, layer)).toEqual({});
});

it('should display warning on exclusive groups layers', () => {
  const map = {
    getZoom: jest.fn(() => 7),
    getSource: jest.fn(() => ({ minzoom: 14, maxzoom: 22 })),
    getLayer: jest.fn(id => ({
      id,
      minzoom: id === '1' ? 12 : 8,
      maxzoom: id === '1' ? 16 : 12,
    })),
    getStyle: () => ({
      layers: [{
        id: '1',
        minzoom: 12,
        maxzoom: 16,
      }, {
        id: '2',
        minzoom: 8,
        maxzoom: 12,
      }, {
        id: '3',
        minzoom: 8,
        maxzoom: 12,
      }],
    }),
  };
  const layer = {
    group: 'foo',
    layers: [{
      id: 'layer1',
      layers: ['1'],
      minzoom: 12,
      maxzoom: 16,
    }, {
      id: 'layer2',
      layers: ['2', '3'],
      minzoom: 8,
      maxzoom: 12,
    }],
  };
  expect(displayWarningAccordingToZoom(map, layer)).toEqual({ display: true, minZoomLayer: 8 });
});
