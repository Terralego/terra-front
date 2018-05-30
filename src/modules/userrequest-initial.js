const initialState = {
  formStep: 0,
  submitted: false,
  sent: false,
  error: null,
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
