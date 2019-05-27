import { TYPE_SINGLE, TYPE_MANY, TYPE_RANGE, TYPE_BOOL } from '../../../modules/Forms/Filters/index';

export default [{
  label: 'Couche 1',
  initialState: {
    active: true,
  },
  filters: {
    fields: [],
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
      values: ['foo', 'bar'],
    }, {
      label: 'Many values from a short list displayed as a select',
      property: 'short-many-enum-as-select',
      type: TYPE_MANY,
      values: ['foo', 'bar'],
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
  label: 'Couche 2',
  initialState: {
    active: true,
    opacity: 0.2,
  },
}, {
  group: 'Groupées',
  layers: [{
    label: 'Couche 3',
  }, {
    label: 'Couche 4',
  }],
}, {
  label: 'Variantes',
  sublayers: [{
    label: 'Couche 5',
  }, {
    label: 'Couche 6',
  }, {
    label: 'Couche 7',
  // }, {
  //   label: 'Couche 8',
  // }, {
  //   label: 'Couche 9',
  // }, {
  //   label: 'Couche 10',
  }],
}];
