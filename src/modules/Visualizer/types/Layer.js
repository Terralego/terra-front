import PropTypes from 'prop-types';

import { TYPE_SINGLE, TYPE_MANY, TYPE_RANGE, TYPE_BOOL } from '../../Forms/Filters/index';

export const LayerProps = PropTypes.shape({
  /** Layer's label */
  label: PropTypes.string,
  /** Group name */
  group: PropTypes.string,
  /** If a group, you must specify other layers */
  // eslint-disable-next-line no-use-before-define
  // layers: PropTypes.arrayOf(LayerProps),
  /** If a group, may be exclusive if only one layer must be active */
  exclusive: PropTypes.bool,
  /** If group, describe optional selectors menus to easy select big list of layers */
  selectors: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
  })),
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
      format: PropTypes.oneOf(['date', 'number']),
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

export default LayerProps;
