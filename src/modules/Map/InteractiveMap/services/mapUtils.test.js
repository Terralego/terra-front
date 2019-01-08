import { toggleLayerVisibility, getOpacityProperty, setLayerOpacity, getInteractionOnEvent, setInteractions } from './mapUtils';

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
    getLayer: jest.fn(() => ({ type: 'line' })),
    setPaintProperty: jest.fn(),
  };
  setLayerOpacity(map, 'foo', 42);
  expect(map.getLayer).toHaveBeenCalledWith('foo');
  expect(map.setPaintProperty).toHaveBeenCalledWith('foo', 'line-opacity', 42);
});

it('should not set layer opacity', () => {
  const map = {
    getLayer: jest.fn(() => ({ type: 'bar' })),
    setPaintProperty: jest.fn(),
  };
  setLayerOpacity(map, 'foo', 42);
  expect(map.getLayer).toHaveBeenCalledWith('foo');
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
  const interaction = getInteractionOnEvent({ eventType, map, point, interactions });

  expect(map.queryRenderedFeatures).toHaveBeenCalledWith(point);
  expect(interaction).toEqual({
    interaction: interactions[0],
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
  const interaction = getInteractionOnEvent({ eventType, map, point, interactions });

  expect(map.queryRenderedFeatures).toHaveBeenCalledWith(point);
  expect(interaction).toEqual({
    interaction: interactions[1],
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
  const interaction = getInteractionOnEvent({ eventType, map, point, interactions });

  expect(map.queryRenderedFeatures).toHaveBeenCalledWith(point);
  expect(interaction).toBe(false);
});


describe('should set interactions', () => {
  let listeners = [];
  const map = {
    on: jest.fn((event, id, listener) => listeners.push({
      event,
      listener: listener || id,
      id: listener ? id : null,
    })),
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
    expect(listeners.length).toBe(3);
    expect(listeners[0].event).toBe('click');
    expect(listeners[1].event).toBe('mousedown');
    expect(listeners[2].event).toBe('mousemove');
  });

  it('with mouseover events', () => {
    const interactions = [{
      id: 'foo',
      interaction: 'doSomething',
      trigger: 'mouseover',
    }];
    const callback = () => {};
    setInteractions({ map, interactions, callback });
    expect(listeners.length).toBe(3);
    expect(listeners[0].event).toBe('mousemove');
    expect(listeners[1].event).toBe('mouseleave');
    expect(listeners[1].id).toBe('foo');
    expect(listeners[2].event).toBe('mousemove');
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
    listeners[0].listener(event);
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
    listeners[0].listener(event);
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

    listeners[0].listener(event);
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
      eventType: 'mousemove',
    });
    callback.mockClear();

    listeners[1].listener(event);
    expect(listeners[1].event).toBe('mouseleave');
    expect(listeners[1].id).toBe('foo');
    expect(callback).toHaveBeenCalledWith({
      event,
      map,
      layerId: 'foo',
      interaction: interactions[0],
      eventType: 'mouseleave',
    });
  });

  it('and display pointer cursor', () => {
    const interactions = [{
      id: 'foo',
      interaction: 'doSomething',
    }];
    const callback = () => {};
    const canvas = { style: {} };
    map.getCanvas = jest.fn(() => canvas);
    map.queryRenderedFeatures = () => [{
      layer: {
        id: 'foo',
      },
    }];

    setInteractions({ map, interactions, callback });

    listeners[1].listener({ target: map, point: [1, 2] });

    expect(map.getCanvas).toHaveBeenCalled();
    expect(canvas.style.cursor).toBe('pointer');

    map.queryRenderedFeatures = () => [];

    listeners[1].listener({ target: map, point: [1, 2] });

    expect(map.getCanvas).toHaveBeenCalled();
    expect(canvas.style.cursor).toBe('');
  });
});
