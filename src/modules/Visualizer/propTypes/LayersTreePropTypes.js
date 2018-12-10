import PropTypes from 'prop-types';

export const LayersTreeProps = PropTypes.arrayOf(PropTypes.shape({
  label: PropTypes.string.isRequired,
  layers: PropTypes.arrayOf(PropTypes.string),
  initialState: PropTypes.shape({
    active: PropTypes.bool,
  }),
}));

export const LayersTreeGroupProps = PropTypes.arrayOf(PropTypes.shape({
  group: PropTypes.string.isRequired,
  layers: LayersTreeProps.isRequired,
}));

export default PropTypes.oneOfType([LayersTreeProps, LayersTreeGroupProps]);
