import {
  getLayers,
  toggleLayerVisibility,
  getOpacityProperty,
  setLayerOpacity,
  getInteractionsOnEvent,
  setInteractions,
  checkContraints,
  fitZoom,
} from './mapUtils';

const getStyle = jest.fn(() => ({
  layers: [{
    id: 'foo',
    type: 'fill',
    paint: {
      'fill-opacity': 1,
    },
  }, {
    id: 'layer-0',
    type: 'fill',
    paint: {
      'fill-opacity': 1,
    },
  }, {
    id: 'layer-unclustered-0',
    type: 'fill',
    paint: {
      'fill-opacity': 1,
    },
  }, {
    id: 'layer-count-0',
    type: 'fill',
    paint: {
      'fill-opacity': 1,
    },
  }, {
    id: 'bar',
  }],
}));

jest.useFakeTimers();

it('should get all layers related to main one', () => {
  const map = {
    getStyle,
  };

  expect(getLayers(map, 'foo')).toEqual([{
    id: 'foo',
    type: 'fill',
    paint: {
      'fill-opacity': 1,
    },
  }]);
  expect(getLayers(map, 'bar')).toEqual([{
    id: 'bar',
  }]);

  expect(getLayers(map, 'layer')).toEqual([{
    id: 'layer-0',
    type: 'fill',
    paint: {
      'fill-opacity': 1,
    },
  }, {
    id: 'layer-unclustered-0',
    type: 'fill',
    paint: {
      'fill-opacity': 1,
    },
  }, {
    id: 'layer-count-0',
    type: 'fill',
    paint: {
      'fill-opacity': 1,
    },
  }]);
});

it('should toggle layer visibility', () => {
  const map = {
    setLayoutProperty: jest.fn(),
    getStyle,
  };
  toggleLayerVisibility(map, 'foo', 'visible');
  expect(map.setLayoutProperty).toHaveBeenCalledWith('foo', 'visibility', 'visible');
  map.setLayoutProperty.mockClear();
  toggleLayerVisibility(map, 'foo', 'none');
  expect(map.setLayoutProperty).toHaveBeenCalledWith('foo', 'visibility', 'none');
  map.setLayoutProperty.mockClear();
  toggleLayerVisibility(map, 'layer', 'visible');
  expect(map.setLayoutProperty).toHaveBeenCalledWith('layer-0', 'visibility', 'visible');
  expect(map.setLayoutProperty).toHaveBeenCalledWith('layer-unclustered-0', 'visibility', 'visible');
  expect(map.setLayoutProperty).toHaveBeenCalledWith('layer-count-0', 'visibility', 'visible');
});

it('should get opacity property', () => {
  expect(getOpacityProperty('background')).toBe('background-opacity');
  expect(getOpacityProperty('fill')).toBe('fill-opacity');
  expect(getOpacityProperty('line')).toBe('line-opacity');
  expect(getOpacityProperty('symbol')).toBe('icon-opacity');
  expect(getOpacityProperty('raster')).toBe('raster-opacity');
  expect(getOpacityProperty('circle')).toBe('circle-opacity');
  expect(getOpacityProperty('fill-extrusion')).toBe('fill-extrusion-opacity');
  expect(getOpacityProperty('foo')).toBe(null);
});

it('should set layer opacity', () => {
  const map = {
    setPaintProperty: jest.fn(),
    getStyle,
  };
  setLayerOpacity(map, 'foo', 0);
  expect(map.setPaintProperty).toHaveBeenCalledWith('foo', 'fill-opacity', 0);
  map.setPaintProperty.mockClear();

  setLayerOpacity(map, 'bar', 1);
  expect(map.setPaintProperty).not.toHaveBeenCalled();
});

it('should get interaction on event', () => {
  const interactions = [{
    id: 'foo',
  }, {
    id: 'bar',
    trigger: 'mouseover',
  }, {
    id: 'foobar',
    trigger: 'click',
  }];
  const map = {
    getStyle,
    getLayoutProperty: jest.fn(() => 'visible'),
    queryRenderedFeatures: jest.fn(() => [{
      layer: {
        id: 'foo',
      },
    }, {
      layer: {
        id: 'bar',
      },
    }, {
      layer: {
        id: 'foobar',
      },
    }]),
  };
  const eventType = 'click';
  const point = [1, 2];
  const interaction = getInteractionsOnEvent({ eventType, map, point, interactions });

  expect(map.queryRenderedFeatures).toHaveBeenCalledWith(point);
  expect(interaction).toEqual({
    interactions: [interactions[0]],
    feature: {
      layer: {
        id: 'foo',
      },
    },
    layerId: 'foo',
  });
});

it('should get interaction on mouseover event', () => {
  const interactions = [{
    id: 'foo',
    trigger: 'click',
  }, {
    id: 'bar',
    trigger: 'mouseover',
  }, {
    id: 'foobar',
  }];
  const map = {
    getStyle,
    getLayoutProperty: jest.fn(() => 'visible'),
    queryRenderedFeatures: jest.fn(() => [{
      layer: {
        id: 'foo',
      },
    }, {
      layer: {
        id: 'bar',
      },
    }, {
      layer: {
        id: 'foobar',
      },
    }]),
  };
  const eventType = 'mousemove';
  const point = [1, 2];
  const interaction = getInteractionsOnEvent({ eventType, map, point, interactions });

  expect(map.queryRenderedFeatures).toHaveBeenCalledWith(point);
  expect(interaction).toEqual({
    interactions: [interactions[1]],
    feature: {
      layer: {
        id: 'bar',
      },
    },
    layerId: 'bar',
  });
});

it('should get no interaction on event', () => {
  const interactions = [{
    id: 'foo',
    trigger: 'click',
  }, {
    id: 'bar',
    trigger: 'click',
  }];
  const map = {
    getStyle,
    getLayoutProperty: jest.fn(() => 'visible'),
    queryRenderedFeatures: jest.fn(() => [{
      layer: {
        id: 'foo',
      },
    }, {
      layer: {
        id: 'bar',
      },
    }]),
  };
  const eventType = 'mousover';
  const point = [1, 2];
  const interaction = getInteractionsOnEvent({ eventType, map, point, interactions });

  expect(map.queryRenderedFeatures).toHaveBeenCalledWith(point);
  expect(interaction).toBe(false);
});


describe('should set interactions', () => {
  let listeners = [];
  const canvas = { style: {} };
  const map = {
    getStyle,
    getLayoutProperty: jest.fn(() => 'visible'),
    on: jest.fn((event, id, listener) => listeners.push({
      event,
      listener: listener || id,
      id: listener ? id : null,
    })),
    getCanvas: jest.fn(() => canvas),
  };
  beforeEach(() => {
    listeners = [];
  });

  it('with click events', () => {
    const interactions = [{
      id: 'foo',
      interaction: 'doSomething',
    }, {
      id: 'foo',
      interaction: 'doSomethingOther',
      trigger: 'mousedown',
    }];
    const callback = () => {};
    setInteractions({ map, interactions, callback });
    expect(listeners.length).toBe(4);
    expect(listeners[0].event).toBe('mouseenter');
    expect(listeners[1].event).toBe('mouseleave');
    expect(listeners[2].event).toBe('click');
    expect(listeners[3].event).toBe('mousedown');
  });

  it('with mouseover events', () => {
    const interactions = [{
      id: 'foo',
      interaction: 'doSomething',
      trigger: 'mouseover',
    }];
    const callback = () => {};
    setInteractions({ map, interactions, callback });
    expect(listeners.length).toBe(4);
    expect(listeners[0].event).toBe('mouseenter');
    expect(listeners[1].event).toBe('mouseleave');
    expect(listeners[2].event).toBe('mouseleave');
    expect(listeners[3].event).toBe('mousemove');
    expect(listeners[0].id).toBe('foo');
  });

  it('then call callback', () => {
    const interactions = [{
      id: 'foo',
      interaction: 'doSomething',
    }];
    const callback = jest.fn();
    const event = { target: map, point: [1, 2] };
    map.queryRenderedFeatures = () => [{
      layer: {
        id: 'foo',
      },
    }, {
      layer: {
        id: 'bar',
      },
    }, {
      layer: {
        id: 'foobar',
      },
    }];

    setInteractions({ map, interactions, callback });
    listeners[2].listener(event);
    jest.runAllTimers();

    expect(callback).toHaveBeenCalledWith({
      event,
      map,
      layerId: 'foo',
      feature: {
        layer: {
          id: 'foo',
        },
      },
      interaction: interactions[0],
      eventType: 'click',
    });
  });

  it('then call no callback', () => {
    const interactions = [{
      id: 'foo',
      interaction: 'doSomething',
    }];
    const callback = jest.fn();
    const event = { target: map, point: [1, 2] };
    map.queryRenderedFeatures = () => [];

    setInteractions({ map, interactions, callback });
    listeners[2].listener(event);
    jest.runAllTimers();

    expect(callback).not.toHaveBeenCalled();
  });

  it('then call callback with mousemove', () => {
    const interactions = [{
      id: 'foo',
      interaction: 'doSomething',
      trigger: 'mouseover',
    }];
    const callback = jest.fn();
    const event = { target: map, point: [1, 2] };
    map.queryRenderedFeatures = () => [{
      layer: {
        id: 'foo',
      },
    }];

    setInteractions({ map, interactions, callback });

    listeners[2].listener(event);
    jest.runAllTimers();

    expect(callback).toHaveBeenCalledWith({
      event,
      map,
      layerId: 'foo',
      feature: {
        layer: {
          id: 'foo',
        },
      },
      interaction: interactions[0],
      eventType: 'mouseleave',
    });
    callback.mockClear();

    listeners[3].listener(event);
    jest.runAllTimers();

    expect(listeners[3].event).toBe('mousemove');
    expect(callback).toHaveBeenCalledWith({
      event,
      map,
      layerId: 'foo',
      interaction: interactions[0],
      eventType: 'mousemove',
      feature: {
        layer: {
          id: 'foo',
        },
      },
    });
  });

  it('and display pointer cursor', () => {
    const interactions = [{
      id: 'foo',
      interaction: 'doSomething',
    }];
    const callback = () => {};

    setInteractions({ map, interactions, callback });

    listeners[0].listener({ target: map, point: [1, 2] });
    jest.runAllTimers();

    expect(map.getCanvas).toHaveBeenCalled();
    expect(canvas.style.cursor).toBe('pointer');

    listeners[0].listener({ target: map, point: [1, 2] });
    listeners[1].listener({ target: map, point: [1, 2] });
    expect(canvas.style.cursor).toBe('pointer');

    listeners[1].listener({ target: map, point: [1, 2] });
    jest.runAllTimers();

    expect(map.getCanvas).toHaveBeenCalled();
    expect(canvas.style.cursor).toBe('');
  });
});

it('should check contraints', () => {
  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
    },
  })).toBe(true);

  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
    },
    constraints: [],
  })).toBe(true);

  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
    },
    constraints: [{ minZoom: 1, maxZoom: 2 }],
  })).toBe(true);

  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
    },
    constraints: [{ minZoom: 1, maxZoom: 3 }],
  })).toBe(true);
  expect(checkContraints({
    map: {
      getZoom: () => 3,
      getStyle,
    },
    constraints: [{ minZoom: 1, maxZoom: 2 }],
  })).toBe(false);
  expect(checkContraints({
    map: {
      getZoom: () => 3,
      getStyle,
    },
    constraints: [{ minZoom: 4, maxZoom: 5 }],
  })).toBe(false);

  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
      getLayoutProperty: () => 'visible',
    },
    constraints: [{ withLayers: ['foo-bar*34"/fgù%'] }],
  })).toBe(false);

  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
      getLayoutProperty: () => 'none',
    },
    constraints: [{ withLayers: ['foo'] }],
  })).toBe(false);

  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
      getLayoutProperty: () => 'visible',
    },
    constraints: [{ withLayers: ['bar', 'not-present'] }],
  })).toBe(false);

  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
      getLayoutProperty: layerId => (layerId === 'foo' ? 'visible' : 'none'),
    },
    constraints: [{ withLayers: ['foo', '!bar'] }],
  })).toBe(true);

  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
      getLayoutProperty: layerId => (layerId === 'foo' ? 'visible' : 'none'),
    },
    constraints: [{ minZoom: 1, maxZoom: 3, withLayers: ['foo', '!bar'] }],
  })).toBe(true);

  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
      getLayoutProperty: layerId => (layerId === 'foo' ? 'visible' : 'none'),
    },
    constraints: [{ minZoom: 1, maxZoom: 3, withLayers: ['foo', '!bar'] }],
  })).toBe(true);

  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
    },
    constraints: [{ isCluster: true }],
    feature: {
      properties: {
        cluster: true,
      },
    },
  })).toBe(true);

  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
    },
    constraints: [{ isCluster: false }],
    feature: {
      properties: {
        cluster: true,
      },
    },
  })).toBe(false);

  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
      getLayoutProperty: layerId => (layerId === 'bar' ? 'visible' : 'none'),
    },
    constraints: [{ isCluster: true, withLayers: ['bar', '!foo'] }],
    feature: {
      properties: {
        cluster: true,
      },
    },
  })).toBe(true);

  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
      getLayoutProperty: layerId => (layerId === 'bar' ? 'visible' : 'none'),
    },
    constraints: [
      { isCluster: true, withLayers: ['bar', '!foo'] },
      { isCluster: false, withLayers: ['!bar', 'foo'] },
    ],
    feature: {
      properties: {
        cluster: true,
      },
    },
  })).toBe(true);

  expect(checkContraints({
    map: {
      getZoom: () => 2,
      getStyle,
      getLayoutProperty: layerId => (layerId === 'bar' ? 'visible' : 'none'),
    },
    constraints: [
      { isCluster: false, withLayers: ['bar', '!foo'] },
      { isCluster: false, withLayers: ['!bar', 'foo'] },
    ],
    feature: {
      properties: {
        cluster: true,
      },
    },
  })).toBe(false);
});

it('should get interactions responding to constraints', () => {
  const map = {
    getStyle,
    getLayoutProperty: jest.fn(() => 'visible'),
    getZoom: () => 3,
    queryRenderedFeatures: () => [{
      layer: {
        id: 'foo',
      },
    }],
  };
  const interactions = [{
    id: 'foo',
    interaction: 'foo',
    constraints: [{
      minZoom: 1,
      maxZoom: 2,
    }],
  }, {
    id: 'foo',
    interaction: 'foo',
    constraints: [{
      minZoom: 2,
      maxZoom: 3,
    }],
  }];
  const interaction = getInteractionsOnEvent({ eventType: 'click', map, points: [], interactions });
  expect(interaction.interactions).toEqual([interactions[1]]);
});

it('should get multiple interactions', () => {
  const map = {
    getStyle,
    getLayoutProperty: jest.fn(() => 'visible'),
    getZoom: () => 3,
    queryRenderedFeatures: () => [{
      layer: {
        id: 'foo',
      },
    }],
  };
  const interactions = [{
    id: 'foo',
    interaction: 'foo',
  }, {
    id: 'foo',
    interaction: 'foo',
  }];
  const interaction = getInteractionsOnEvent({ eventType: 'click', map, points: [], interactions });
  expect(interaction.interactions).toEqual(interactions);
});

it('should call fitBounds', () => {
  const map = { fitBounds: jest.fn() };

  const feature = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [
            -33.83789062499999,
            60.37042901631508,
          ],
          [
            -39.814453125,
            55.825973254619015,
          ],
        ],
      ],
    },
  };
  fitZoom({ feature, map });
  expect(map.fitBounds).toHaveBeenCalled();
  map.fitBounds.mockClear();

  fitZoom({ feature: [feature], map });
  expect(map.fitBounds).toHaveBeenCalled();
});

it('should catch error when fetching feature', () => {
  const map = {
    queryRenderedFeatures: () => {
      throw new Error('boum');
    },
  };
  expect(() => getInteractionsOnEvent({
    map,
  })).not.toThrow();
});
