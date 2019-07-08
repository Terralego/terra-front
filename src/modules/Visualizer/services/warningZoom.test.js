import {
  getMinMax, displayWarningAccordingToZoom,
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

it('should getMinMax with default param', () => {
  expect(getMinMax([{}])).toEqual({ maxzoom: 24, minzoom: 0 });
});

it('should getMinMax with params', () => {
  expect(getMinMax([{ minzoom: 0, maxzoom: 22 }])).toEqual({ maxzoom: 22, minzoom: 0 });
  expect(getMinMax([{}], 8, 12)).toEqual({ maxzoom: 12, minzoom: 8 });
});


it('should display warning according to curret zoom', () => {
  const map = {
    getZoom: jest.fn(() => 7),
    getSource: jest.fn(() => ({ minzoom: 14, maxzoom: 22 })),
    getStyle,
  };
  const layer = { layers: ['foo'] };
  expect(displayWarningAccordingToZoom(map, layer)).toEqual({ display: true, minZoomLayer: 14 });
});

it('should not display warning according to curret zoom', () => {
  const map = {
    getZoom: jest.fn(() => 17),
    getSource: jest.fn(() => ({ minzoom: 14, maxzoom: 22 })),
    getStyle,
  };
  const layer = { layers: ['foo'] };
  expect(displayWarningAccordingToZoom(map, layer)).toEqual({ display: false, minZoomLayer: 14 });
});

it('should displayWarningAccordingToZoom without map', () => {
  const map = undefined;
  const layer = { layers: ['foo'] };
  expect(displayWarningAccordingToZoom(map, layer)).toEqual({});
});
