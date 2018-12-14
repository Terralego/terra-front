import PropTypes from 'prop-types';

export const LayersTreeProps = PropTypes.shape({
  label: PropTypes.string.isRequired,
  layers: PropTypes.arrayOf(PropTypes.string),
  initialState: PropTypes.shape({
    active: PropTypes.bool,
  }),
});

export const LayersTreeGroupProps = PropTypes.shape({
  group: PropTypes.string.isRequired,
  layers: PropTypes.arrayOf(LayersTreeProps.isRequired),
});

export default PropTypes.arrayOf(PropTypes.oneOfType([
  LayersTreeProps,
  LayersTreeGroupProps,
]));
