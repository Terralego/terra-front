export default [{
  label: 'Background',
  initialState: {
    active: true,
  },
  active: {
    layouts: [{
      id: 'background',
      visibility: 'visible',
    }],
  },
  inactive: {
    layouts: [{
      id: 'background',
      visibility: 'none',
    }],
  },
}, {
  label: 'Road',
  initialState: {
    active: true,
  },
  active: {
    layouts: [{
      id: 'road',
      visibility: 'visible',
    }],
  },
  inactive: {
    layouts: [{
      id: 'road',
      visibility: 'none',
    }],
  },
}, {
  label: 'Water',
  initialState: {
    active: true,
  },
  active: {
    layouts: [{
      id: 'water',
      visibility: 'visible',
    }, {
      id: 'waterway',
      visibility: 'visible',
    }],
  },
  inactive: {
    layouts: [{
      id: 'water',
      visibility: 'none',
    }, {
      id: 'waterway',
      visibility: 'none',
    }],
  },
}];
