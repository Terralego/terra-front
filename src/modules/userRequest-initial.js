const initialState = {
  formStep: 0,
  submitted: false,
  sent: false,
  apiError: null,
  validationErrors: {},
  data: {
    state: 0,
    geojson: {
      type: 'FeatureCollection',
      features: [],
    },
    organization: [1],
    properties: {
    },
  },
};
export default initialState;
