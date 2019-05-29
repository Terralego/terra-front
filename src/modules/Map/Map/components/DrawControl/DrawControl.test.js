import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import { DrawControl } from './DrawControl';

jest.mock('@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw');
MapboxDraw.modes = {};


describe('Init draw', () => {
  const map = {
    on: jest.fn(),
  };
  const onDrawActionable = jest.fn();
  const onDrawCombine = jest.fn();
  const onDrawCreate = jest.fn();
  const onDrawDelete = jest.fn();
  const onDrawModeChange = jest.fn();
  const onDrawRender = jest.fn();
  const onDrawSelectionChange = jest.fn();
  const onDrawUncombine = jest.fn();
  const onDrawUpdate = jest.fn();

  beforeEach(() => {
    map.on.mockClear();
  });

  it('should init with all actions', () => {
    const controlInstance = new DrawControl({
      map,
      onDrawActionable,
      onDrawCombine,
      onDrawCreate,
      onDrawDelete,
      onDrawModeChange,
      onDrawRender,
      onDrawSelectionChange,
      onDrawUncombine,
      onDrawUpdate,
      modes: { foo: 'bar' },
    });


    expect(MapboxDraw).toHaveBeenCalledWith({ modes: { foo: 'bar' } });
    expect(controlInstance).toBeInstanceOf(MapboxDraw);
    expect(map.on).toHaveBeenCalledWith('draw.actionable', onDrawActionable);
    expect(map.on).toHaveBeenCalledWith('draw.combine', onDrawCombine);
    expect(map.on).toHaveBeenCalledWith('draw.create', onDrawCreate);
    expect(map.on).toHaveBeenCalledWith('draw.delete', onDrawDelete);
    expect(map.on).toHaveBeenCalledWith('draw.modechange', onDrawModeChange);
    expect(map.on).toHaveBeenCalledWith('draw.render', onDrawRender);
    expect(map.on).toHaveBeenCalledWith('draw.selectionchange', onDrawSelectionChange);
    expect(map.on).toHaveBeenCalledWith('draw.uncombine', onDrawUncombine);
    expect(map.on).toHaveBeenCalledWith('draw.update', onDrawUpdate);
  });

  it('should init with only `draw.create` action', () => {
    const controlInstance = new DrawControl({
      map,
      onDrawCreate,
    });

    expect(controlInstance).toBeInstanceOf(MapboxDraw);
    expect(map.on).toHaveBeenCalledTimes(1);
    expect(map.on).toHaveBeenCalledWith('draw.create', onDrawCreate);
  });
});
