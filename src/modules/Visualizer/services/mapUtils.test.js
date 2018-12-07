import { toggleLayerVisibility, addListenerOnLayer } from './mapUtils';

it('should toggle layer visibility', () => {
  const map = {
    setLayoutProperty: jest.fn(),
  };
  toggleLayerVisibility(map, 'foo', 'visible');
  expect(map.setLayoutProperty).toHaveBeenCalledWith('foo', 'visibility', 'visible');
  map.setLayoutProperty.mockClear();
  toggleLayerVisibility(map, 'foo', 'none');
  expect(map.setLayoutProperty).toHaveBeenCalledWith('foo', 'visibility', 'none');
});

it('should add a listener on layer', () => {
  const mapListeners = [];
  const map = {
    on: jest.fn((trigger, layerId, fn) => mapListeners.push({ trigger, layerId, fn })),
  };
  const listener = jest.fn();
  const listeners = addListenerOnLayer(map, 'foo', listener);
  expect(listeners.length).toBe(1);
  mapListeners[0].fn({ features: [] });

  expect(listener).toHaveBeenCalled();
});

it('should add a listener on layer with display cursor', () => {
  const mapListeners = [];
  const mapCanvas = { style: {} };
  const map = {
    on: jest.fn((trigger, layerId, fn) => mapListeners.push({ trigger, layerId, fn })),
    getCanvas: jest.fn(() => mapCanvas),
  };
  const listener = () => null;
  const listeners = addListenerOnLayer(map, 'foo', listener, { displayCursor: true });
  expect(listeners.length).toBe(3);
  mapListeners[1].fn({ features: [] });
  expect(map.getCanvas).toHaveBeenCalled();
  expect(mapCanvas.style.cursor).toBe('pointer');
  map.getCanvas.mockClear();

  mapListeners[2].fn({ features: [] });
  expect(map.getCanvas).toHaveBeenCalled();
  expect(mapCanvas.style.cursor).toBe('');
});
