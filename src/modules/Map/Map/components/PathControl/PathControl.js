import MapboxPathControl from '@makina-corpus/mapbox-gl-path';

export class PathControl {
  constructor ({ onPathCreate, onPathDelete, onPathUpdate, map, ...props }) {
    this.PathControl = new MapboxPathControl({ ...props });

    if (onPathCreate) {
      map.on('MapboxPathControl.create', onPathCreate);
    }
    if (onPathDelete) {
      map.on('MapboxPathControl.delete', onPathDelete);
    }
    if (onPathUpdate) {
      map.on('MapboxPathControl.update', onPathUpdate);
    }
    // eslint-disable-next-line no-param-reassign
    map.weightAttributionHooks = map.weightAttributionHooks || {};
    // eslint-disable-next-line no-param-reassign
    map.weightAttributionHooks.pathControl = layer => layer.id.startsWith('gl-pathControl') && map.getMaxWeight();

    // eslint-disable-next-line no-param-reassign
    map.pathControl = this.PathControl;

    const prevOnRemove = this.PathControl.onRemove.bind(this.PathControl);

    this.PathControl.onRemove = () => {
      if (onPathCreate) {
        map.off('MapboxPathControl.create', onPathCreate);
      }
      if (onPathDelete) {
        map.off('MapboxPathControl.delete', onPathDelete);
      }
      if (onPathUpdate) {
        map.off('MapboxPathControl.update', onPathUpdate);
      }
      prevOnRemove(this.PathControl);
      // eslint-disable-next-line no-param-reassign
      delete map.weightAttributionHooks.pathControl;
      // eslint-disable-next-line no-param-reassign
      map.pathControl = undefined;
    };


    return this.PathControl;
  }
}

export default PathControl;
