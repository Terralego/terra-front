const initialState = {
  state: 0,
  geojson: {
    type: 'FeatureCollection',
    features: [],
  },
  organization: [1],
  properties: {
    project: {
      title: '',
      description: '',
    },
    address: {
      city: '',
      state: '',
    },
  },
};
export default initialState;
