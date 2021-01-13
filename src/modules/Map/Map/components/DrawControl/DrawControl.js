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

    // eslint-disable-next-line no-param-reassign
    map.draw = this.draw;

    const prevOnRemove = this.draw.onRemove.bind(this.draw);

    this.draw.onRemove = () => {
      if (onDrawActionable) {
        map.off('draw.actionable', onDrawActionable);
      }
      if (onDrawCombine) {
        map.off('draw.combine', onDrawCombine);
      }
      if (onDrawCreate) {
        map.off('draw.create', onDrawCreate);
      }
      if (onDrawDelete) {
        map.off('draw.delete', onDrawDelete);
      }
      if (onDrawModeChange) {
        map.off('draw.modechange', onDrawModeChange);
      }
      if (onDrawRender) {
        map.off('draw.render', onDrawRender);
      }
      if (onDrawSelectionChange) {
        map.off('draw.selectionchange', onDrawSelectionChange);
      }
      if (onDrawUncombine) {
        map.off('draw.uncombine', onDrawUncombine);
      }
      if (onDrawUpdate) {
        map.off('draw.update', onDrawUpdate);
      }
      prevOnRemove(map);
      // eslint-disable-next-line no-param-reassign
      map.draw = undefined;
    };

    return this.draw;
  }
}

export default DrawControl;
