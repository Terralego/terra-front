import PropTypes from 'prop-types';

import { TYPE_SINGLE, TYPE_MANY, TYPE_RANGE, TYPE_BOOL } from '../../Forms/Filters/index';

export default PropTypes.shape({
  /** Layer's label */
  label: PropTypes.string,
  /** Initial layer state */
  initialState: PropTypes.shape({
    active: PropTypes.bool,
    opacity: PropTypes.number,
  }),
  /** Filters to display */
  filters: PropTypes.shape({
    /** List of filters controls */
    form: PropTypes.arrayOf(PropTypes.shape({
      /** Control's label */
      label: PropTypes.string.isRequired,
      /** Property to apply the value */
      property: PropTypes.string.isRequired,
      /** Type of control */
      type: PropTypes.oneOf([TYPE_SINGLE, TYPE_MANY, TYPE_RANGE, TYPE_BOOL]),
      /** Format of control for some types */
      format: PropTypes.oneOf(['date']),
      /** Force a specific conrtrol display */
      display: PropTypes.oneOf(['select']),
    })),
  }),
  /** Widgets list */
  widgets: PropTypes.arrayOf(PropTypes.shape({
    /** Widget name */
    component: PropTypes.string,
  })),
  /** Layer can be hidden by setting false here */
  displayed: PropTypes.bool,
});
