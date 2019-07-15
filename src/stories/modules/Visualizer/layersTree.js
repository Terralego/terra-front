import { TYPE_SINGLE, TYPE_MANY, TYPE_RANGE, TYPE_BOOL } from '../../../modules/Forms/Filters/index';

export default [{
  label: 'Très long nom de couche',
  initialState: {
    active: true,
  },
  filters: {
    fields: [{
      label: 'foo',
      property: 'foo',
    }],
    form: [{
      label: 'Single value',
      property: 'single',
      type: TYPE_SINGLE,
    }, {
      label: 'Single value from an enum list',
      property: 'single-enum',
      type: TYPE_SINGLE,
      values: Array.from(new Array(12), (v, k) => `${k}`),
    }, {
      label: 'Many values from a short list',
      property: 'short-many-enum',
      type: TYPE_MANY,
      values: ['foo', 'bar', 'kit', 'kat'],
    }, {
      label: 'Many values from a short list displayed as a select',
      property: 'short-many-enum-as-select',
      type: TYPE_MANY,
      values: ['foo', 'bar', 'kit', 'kat'],
      display: 'select',
    }, {
      label: 'Many values from a long list',
      property: 'long-many-enum',
      type: TYPE_MANY,
      values: Array.from(new Array(42), (v, k) => `${k}`),
    }, {
      label: 'Single value from a fetched list',
      property: 'fetched-single-enum',
      type: TYPE_SINGLE,
      fetchValues: true,
    }, {
      label: 'Range numbers value',
      property: 'range-number',
      type: TYPE_RANGE,
      min: 0,
      max: 100,
    }, {
      label: 'Range numbers value with fetched max/min',
      property: 'range-number-fetched',
      type: TYPE_RANGE,
      fetchValues: true,
    }, {
      label: 'Range dates value',
      property: 'range-dates',
      type: TYPE_RANGE,
      format: 'date',
    }, {
      label: 'Boolean value',
      property: 'boolean',
      type: TYPE_BOOL,
    }],
    layer: 'layer1',
  },
  widgets: [{
    component: 'synthesis',
  }],
}, {
  label: 'un extrèmement long long nom de couche',
  initialState: {
    active: true,
    opacity: 0.2,
  },
}, {
  group: 'Groupées inclusives',
  initialState: {
    active: false,
  },
  layers: [{
    label: 'Couche 1',
  }, {
    label: 'Couche 2',
  }, {
    label: 'Couche 3',
  }],
}, {
  group: 'Grouped exclusive with radio',
  exclusive: true,
  layers: [{
    label: 'Couche 4',
  }, {
    label: 'Couche 5',
    filters: {
      fields: [{
        label: 'foo',
        property: 'foo',
      }],
      form: [{
        label: 'foo',
        property: 'foo',
        type: TYPE_SINGLE,
      }],
      layer: 'layer1',
    },
    widgets: [{
      component: 'synthesis',
    }],
  }, {
    label: 'Couche 6',
  }],
}, {
  group: 'Grouped exclusive with select',
  exclusive: true,
  filters: {
    fields: [{
      label: 'foo',
      property: 'foo',
    }],
    form: [{
      label: 'foo',
      property: 'foo',
      type: TYPE_SINGLE,
    }],
    layer: 'layer1',
  },
  widgets: [{
    component: 'synthesis',
  }],
  layers: [{
    label: 'Couche 7',
  }, {
    label: 'Couche 8',
  }, {
    label: 'Couche 9',
  }, {
    label: 'Couche 10',
  }, {
    label: 'Couche 11',
  }, {
    label: 'Couche 12',
  }],
}, {
  group: 'Grouped exclusive with radio and groups wich should not be displayed',
  exclusive: true,
  layers: [{
    label: 'Couche 4',
  }, {
    label: 'Couche 5',
  }, {
    group: 'Group',
    layers: [{
      label: 'Couche 7',
    }, {
      label: 'Couche 8',
    }],
  }, {
    label: 'Couche 6',
  }],
}, {
  group: 'Grouped exclusive with variable choice',
  exclusive: true,
  selectors: [{
    label: 'Year',
    name: 'year',
    values: ['2019', '2018', '2017', '2016'],
  }, {
    label: 'Type',
    name: 'type',
    values: ['foo', 'bar'],
  }],
  layers: [{
    label: 'Couche 13',
    selectorKey: {
      year: '2017',
      type: 'foo',
    },
  }, {
    label: 'Couche 14',
    selectorKey: {
      year: '2019',
      type: 'foo',
    },
  }],
}, {
  group: 'Nested',
  layers: [{
    group: 'Very nested',
    layers: [{
      label: 'Couche 14',
    }, {
      group: 'Very very nested',
      layers: [{
        group: 'We need to go deeper',
        layers: [{
          label: '=_=',
        }, {
          label: 'Couche 15',
        }, {
          group: 'with exclusive group',
          exclusive: true,
          layers: [{
            label: 'Couche 16',
          }, {
            label: 'Couche 17',
          }],
        }],
      }],
    }],
  }, {
    label: 'Couche 13',
  }],
}];
