import React from 'react';
import PropTypes from 'prop-types';
import { connectState } from '../../../State/context';
import { TYPE_RANGE } from '../../../Forms/Filters';
import { serialize } from '../../../../utils/serialize';

import context from './context';
import {
  initLayersStateAction,
  setLayerStateAction,
} from '../../services/layersTreeUtils';

const { Provider } = context;

export class LayersTreeProvider extends React.Component {
  static propTypes = {
    /** Callback executed everytime layersTreeState change. Takes layersTreeState as parameter */
    onChange: PropTypes.func,
    /** Initial state */
    initialState: PropTypes.shape({
      layers: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // Active layer id(s)
      table: PropTypes.string, // Layer if table is active
    }),
    /** Initial layer tree state */
    initialLayersTreeState: PropTypes.instanceOf(Map),
    /**
     * Function called when a filter property of single or many type need to fetch values
     * Takes `layer` and `property` as parameters
     * @return String[]
     * */
    fetchPropertyValues: PropTypes.func,
    /**
     * Function called when a filter property of range type need to fetch min and max
     * Takes `layer` and `property` as parameters
     * @return {{}} Object of form {min: Number, max: Number}
     * */
    fetchPropertyRange: PropTypes.func,
    translate: PropTypes.func,
    setCurrentState: PropTypes.func,
  };

  static defaultProps = {
    onChange () {},
    initialState: {},
    initialLayersTreeState: new Map(),
    fetchPropertyValues () {},
    fetchPropertyRange () {},
    translate: undefined,
    setCurrentState () {},
  };

  constructor (props) {
    super(props);
    const { initialLayersTreeState: layersTreeState } = this.props;
    this.state = { layersTreeState };
  }

  componentDidMount () {
    this.initLayersState();
  }

  componentDidUpdate ({ initialLayersTreeState: prevLayersTreeState, layersTree: prevLayersTree }) {
    const { initialLayersTreeState, layersTree } = this.props;

    if (initialLayersTreeState !== prevLayersTreeState) {
      // Deep comparison to avoid unusefull and buggy rerender.
      // This is a hack waiting better refactoring.
      if (serialize(initialLayersTreeState) !== serialize(prevLayersTreeState)) {
        this.initLayersState(initialLayersTreeState);
      }
    }

    if (layersTree !== prevLayersTree) {
      this.initLayersState();
    }
  }

  componentWillUnmount () {
    this.isUnmount = true;
  }

  setLayerState = ({ layer, state: newState, reset }) => {
    this.resetState(({ layersTreeState }) => ({
      layersTreeState: setLayerStateAction(layer, newState, layersTreeState, reset),
    }));
  };

  getLayerState = ({ layer }) => {
    const { layersTreeState } = this.state;
    return layersTreeState.get(layer) || {};
  };

  fetchPropertiesValues = async (layer, properties) => {
    const { fetchPropertyValues, fetchPropertyRange } = this.props;
    const { layersTreeState } = this.state;
    properties.forEach(property => {
      // We need to keep a static reference to this object because it serve as
      // key in layersTreeState
      // eslint-disable-next-line no-param-reassign
      property.loading = true;
      if (property.type) {
        // eslint-disable-next-line no-param-reassign
        property.values = [];
      }
    });
    this.resetState(new Map(layersTreeState));

    const responses = await Promise.all(properties.map(property =>
      (property.type === TYPE_RANGE
        ? fetchPropertyRange(layer, property)
        : fetchPropertyValues(layer, property))));

    properties.forEach((property, index) => {
      const { type } = property;
      /* eslint-disable no-param-reassign */
      delete property.loading;
      if (type === TYPE_RANGE) {
        const { min = 0, max = 100 } = responses[index] || {};
        property.min = min;
        property.max = max;
      } else {
        property.values = [...(responses[index] || [])];
      }
      /* eslint-enable no-param-reassign */
    });

    const { layersTreeState: newLayersTreeState } = this.state;
    this.resetState(new Map(newLayersTreeState));
  };

  initLayersState = initialLayersTreeState => {
    this.resetState(({ layersTreeState }) => {
      const { layersTree, initialState } = this.props;
      const state = initialLayersTreeState || layersTreeState;

      if (!layersTree) return {};

      return {
        layersTreeState: state.size
          ? state
          : initLayersStateAction(layersTree, initialState),
      };
    });
  };

  /**
   * Reset the tree state.
   *
   * @param {Object|Function} state
   * @param {Function} callback
   */
  resetState (state, callback = () => { }) {
    const { setCurrentState, onChange } = this.props;

    const setStateCallback = () => {
      callback();
      const { layersTreeState = new Map() } = this.state;

      // Simplify the state from the map
      const activeLayers = [];
      let table;

      const populateActiveLayersAndTable = (layerState, { layers: [layerId] = [] }) => {
        if (layerState.active) {
          activeLayers.push(layerId);
        }
        if (layerState.table) {
          table = layerId;
        }
      };

      layersTreeState.forEach(populateActiveLayersAndTable);
      setCurrentState({ layers: activeLayers, table });
      onChange(layersTreeState);
    };

    this.setState(state, setStateCallback);
  }

  render () {
    const {
      children,
      layersTree,
      map,
      translate,
    } = this.props;
    const { layersTreeState } = this.state;
    const {
      initLayersState, setLayerState, getLayerState,
      fetchPropertiesValues,
    } = this;
    const value = {
      map,
      layersTree,
      layersTreeState,
      initLayersState,
      setLayerState,
      getLayerState,
      fetchPropertiesValues,
      translate,
    };
    return (
      <Provider value={value}>
        {children}
      </Provider>
    );
  }
}

export default connectState('initialState', 'setCurrentState')(LayersTreeProvider);
