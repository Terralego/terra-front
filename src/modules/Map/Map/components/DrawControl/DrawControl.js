import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

export class DrawControl {
  constructor ({
    map,
    modes,
    onDrawActionable,
    onDrawCombine,
    onDrawCreate,
    onDrawDelete,
    onDrawModeChange,
    onDrawRender,
    onDrawSelectionChange,
    onDrawUncombine,
    onDrawUpdate,
    ...props
  }) {
    this.draw = new MapboxDraw({
      ...props,
      modes: {
        ...MapboxDraw.modes,
        ...modes,
      },
    });

    if (onDrawActionable) {
      map.on('draw.actionable', onDrawActionable);
    }
    if (onDrawCombine) {
      map.on('draw.combine', onDrawCombine);
    }
    if (onDrawCreate) {
      map.on('draw.create', onDrawCreate);
    }
    if (onDrawDelete) {
      map.on('draw.delete', onDrawDelete);
    }
    if (onDrawModeChange) {
      map.on('draw.modechange', onDrawModeChange);
    }
    if (onDrawRender) {
      map.on('draw.render', onDrawRender);
    }
    if (onDrawSelectionChange) {
      map.on('draw.selectionchange', onDrawSelectionChange);
    }
    if (onDrawUncombine) {
      map.on('draw.uncombine', onDrawUncombine);
    }
    if (onDrawUpdate) {
      map.on('draw.update', onDrawUpdate);
    }

    return this.draw;
  }
}

export default DrawControl;
