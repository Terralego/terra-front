export default [{
  label: 'scenario 1',
  active: {
    layouts: [{
      id: 'background',
      visibility: 'visible',
    }, {
      id: 'road',
      paint: {
        'line-color': '#ff0000',
        'line-opacity': 0.2,
      },
    }],
  },
  inactive: {
    layouts: [{
      id: 'background',
      visibility: 'none',
    }, {
      id: 'road',
      paint: {
        'line-color': '#000000',
        'line-opacity': 1,
      },
    }],
  },
}, {
  label: 'scenario 2',
  active: {
    layouts: [{
      id: 'road',
      visibility: 'visible',
      paint: {
        'line-color': '#0000ff',
      },
    }, {
      id: 'waterway',
      visibility: 'none',
    }],
  },
  inactive: {
    layouts: [{
      id: 'road',
      paint: {
        'line-color': '#000000',
      },
    }, {
      id: 'waterway',
      visibility: 'visible',
    }],
  },
}, {
  label: 'scenario 3',
  active: {
    layouts: [{
      id: 'road',
      visibility: 'none',
    }],
  },
  inactive: {
    layouts: [{
      id: 'road',
      visibility: 'visible',
    }],
  },
}];
