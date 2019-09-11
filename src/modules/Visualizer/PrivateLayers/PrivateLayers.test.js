import PrivateLayers from './PrivateLayers';

it('should render nothing', () => {
  const instance = new PrivateLayers();
  expect(instance.render()).toBeNull();
});

it('should update layers states', () => {
  const setLayerState = jest.fn();
  const layers = [{}, { private: true }];
  const layersTreeState = new Map([[layers[0], { }], [layers[1], { }]]);
  const instance = new PrivateLayers({
    authenticated: false,
    layersTreeState,
    setLayerState,
  });
  instance.updatePrivateLayers();
  expect(setLayerState).toHaveBeenCalledTimes(1);
  expect(setLayerState).toHaveBeenCalledWith({
    layer: layers[1],
    state: {
      hidden: true,
    },
  });
});

it('should update not layers states', () => {
  const setLayerState = jest.fn();
  const layers = [{}, { private: true }];
  const layersTreeState = new Map([[layers[0], { }], [layers[1], { }]]);
  const instance = new PrivateLayers({
    authenticated: true,
    layersTreeState,
    setLayerState,
  });
  instance.updatePrivateLayers();
  expect(setLayerState).not.toHaveBeenCalled();
});

it('should update layers on mount', () => {
  const instance = new PrivateLayers();
  instance.updatePrivateLayers = jest.fn();
  instance.componentDidMount();
  expect(instance.updatePrivateLayers).toHaveBeenCalled();
});

it('should update layers on component update', () => {
  const instance = new PrivateLayers({});
  instance.updatePrivateLayers = jest.fn();

  instance.props = { authenticated: true };
  instance.componentDidUpdate({});
  expect(instance.updatePrivateLayers).toHaveBeenCalled();
  instance.updatePrivateLayers.mockClear();

  instance.props = { layersTreeState: {} };
  instance.componentDidUpdate({});
  expect(instance.updatePrivateLayers).toHaveBeenCalled();
  instance.updatePrivateLayers.mockClear();

  instance.props = { layers: [] };
  instance.componentDidUpdate({});
  expect(instance.updatePrivateLayers).toHaveBeenCalled();
  instance.updatePrivateLayers.mockClear();

  instance.props = { authenticated: true };
  instance.componentDidUpdate({ authenticated: true });
});
