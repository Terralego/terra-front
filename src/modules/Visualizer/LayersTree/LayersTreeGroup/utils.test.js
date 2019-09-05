import { isGroupHidden } from './utils';

const getLayerStateFactory = layers =>
  ({ layer: searched }) => layers.find(layer => layer === searched);

it('should be hidden if all children layers are hidden', () => {
  const layers = [{
    hidden: true,
  }, {
    hidden: true,
  }];
  expect(isGroupHidden(layers, getLayerStateFactory(layers))).toBe(true);
});

it('should not be hidden if some children layers are not hidden', () => {
  const layers = [{
    hidden: false,
  }, {
    hidden: true,
  }];
  expect(isGroupHidden(layers, getLayerStateFactory(layers))).toBe(false);
});

it('should be hidden if all deep children layers are hidden', () => {
  const layer11 = {
    hidden: true,
  };
  const layer21 = {
    hidden: true,
  };
  const layer1 = {
    hidden: true,
    layers: [layer11],
  };
  const layer2 = {
    hidden: true,
    layers: [layer21],
  };
  const layers = [layer1, layer2];
  expect(
    isGroupHidden(layers, getLayerStateFactory([layer1, layer2, layer11, layer21])),
  ).toBe(true);
});

it('should be hidden if some children are not hidden but its children layers are hidden', () => {
  const layer11 = {
    hidden: true,
  };
  const layer21 = {
    hidden: false,
  };
  const layer1 = {
    hidden: false,
    layers: [layer11],
  };
  const layer2 = {
    hidden: true,
    layers: [layer21],
  };
  const layers = [layer1, layer2];
  expect(
    isGroupHidden(layers, getLayerStateFactory([layer1, layer2, layer11, layer21])),
  ).toBe(true);
});

it('should not be hidden if some deep children layers are not hidden', () => {
  const layer11 = {
    hidden: false,
  };
  const layer21 = {
    hidden: true,
  };
  const layer1 = {
    hidden: false,
    layers: [layer11],
  };
  const layer2 = {
    hidden: false,
    layers: [layer21],
  };
  const layers = [layer1, layer2];
  expect(
    isGroupHidden(layers, getLayerStateFactory([layer1, layer2, layer11, layer21])),
  ).toBe(false);
});
