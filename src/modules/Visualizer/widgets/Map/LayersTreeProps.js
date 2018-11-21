import PropTypes from 'prop-types';

export const StylesToApplyProps = PropTypes.shape({
  layouts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    visibility: PropTypes.oneOf(['visible', 'none']),
  })),
});

export default PropTypes.arrayOf(PropTypes.shape({
  label: PropTypes.string.isRequired,
  active: StylesToApplyProps,
  inactive: StylesToApplyProps,
}));
