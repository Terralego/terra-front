import MapboxPathControl from '@makina-corpus/mapbox-gl-path';
import { PathControl } from './PathControl';

jest.mock('@makina-corpus/mapbox-gl-path');
jest.mock('mapbox-gl', () => jest.fn());

MapboxPathControl.mockImplementation(() => ({
  onRemove: jest.fn(),
}));

describe('Init draw', () => {
  const map = {
    on: jest.fn(),
  };
  const onPathCreate = jest.fn();
  const onPathDelete = jest.fn();
  const onPathUpdate = jest.fn();

  beforeEach(() => {
    map.on.mockClear();
  });

  it('should init with all actions', () => {
    // eslint-disable-next-line no-unused-vars
    const controlInstance = new PathControl({
      map,
      onPathCreate,
      onPathDelete,
      onPathUpdate,
    });

    expect(map.on).toHaveBeenCalledWith('MapboxPathControl.create', onPathCreate);
    expect(map.on).toHaveBeenCalledWith('MapboxPathControl.delete', onPathDelete);
    expect(map.on).toHaveBeenCalledWith('MapboxPathControl.update', onPathUpdate);
  });

  it('should init with only `draw.create` action', () => {
    // eslint-disable-next-line no-unused-vars
    const controlInstance = new PathControl({ map, onPathCreate });

    expect(map.on).toHaveBeenCalledTimes(1);
    expect(map.on).toHaveBeenCalledWith('MapboxPathControl.create', onPathCreate);
  });
});

describe('Remove event listeners', () => {
  const map = {
    on: jest.fn(),
    off: jest.fn(),
  };
  const onPathCreate = jest.fn();
  const onPathDelete = jest.fn();
  const onPathUpdate = jest.fn();

  beforeEach(() => {
    map.on.mockClear();
    map.off.mockClear();
  });

  it('Should remove one listener', () => {
    const controlInstance = new PathControl({ map, onPathCreate });

    controlInstance.onRemove();
    expect(map.off).toHaveBeenCalledTimes(1);
    expect(map.off).toHaveBeenCalledWith('MapboxPathControl.create', onPathCreate);
  });

  it('Should remove 3 others listeners', () => {
    const controlInstance = new PathControl({
      map,
      onPathCreate,
      onPathDelete,
      onPathUpdate,
    });
    controlInstance.onRemove();
    expect(map.off).toHaveBeenCalledTimes(3);
  });
});
