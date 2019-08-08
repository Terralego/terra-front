import React from 'react';
import PropTypes from 'prop-types';
import { connectState } from '../../../State/context';

import context from './context';
import {
  initLayersStateAction,
  setLayerStateAction,
} from '../../services/layersTreeUtils';
import translateMock from '../../../../utils/translate';

const { Provider } = context;

export class LayersTreeProvider extends React.Component {
  static propTypes = {
    /** Callback executed everytime layersTreeState change. Takes layersTreeState as parameter */
    onChange: PropTypes.func,
    /** Initial layer tree state */
    initialState: PropTypes.shape({
      layers: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // Active layer id(s)
      table: PropTypes.string, // Layer if table is active
    }),
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
    fetchPropertyValues () {},
    fetchPropertyRange () {},
    setCurrentState () {},
    translate: translateMock({
      'visualizer.layerstree.group.selector': 'No layer found',
    }),
  };

  state = {
    layersTreeState: new Map(),
  };

  componentDidMount () {
    const { initialState } = this.props;
    this.initLayersState(initialState);
  }

  componentDidUpdate ({ layersTree: prevLayersTree }) {
    const { layersTree } = this.props;

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
  }

  getLayerState = ({ layer }) => {
    const { layersTreeState } = this.state;
    return layersTreeState.get(layer) || {};
  }

  fetchPropertyValues = async (layer, property) => {
    const { fetchPropertyValues } = this.props;
    const { layersTreeState } = this.state;
    // We need to keep a static reference to this object because it serve as
    // key in layersTreeState
    // eslint-disable-next-line no-param-reassign
    property.values = [];
    this.resetState(new Map(layersTreeState));
    const properties = (await fetchPropertyValues(layer, property)) || [];
    // eslint-disable-next-line no-param-reassign
    property.values = [...properties];
    const { layersTreeState: newLayersTreeState } = this.state;
    this.resetState(new Map(newLayersTreeState));
  }

  fetchPropertyRange = async (layer, property) => {
    const { fetchPropertyRange } = this.props;
    const { layersTreeState } = this.state;
    // We need to keep a static reference to this object because it serve as
    // key in layersTreeState
    /* eslint-disable no-param-reassign */
    property.min = 0;
    property.max = 100;
    /* eslint-enable no-param-reassign */
    this.resetState(new Map(layersTreeState));
    const { min = 0, max = 100 } = (await fetchPropertyRange(layer, property)) || {};
    /* eslint-disable no-param-reassign */
    property.min = min;
    property.max = max;
    /* eslint-enable no-param-reassign */
    const { layersTreeState: newLayersTreeState } = this.state;
    this.resetState(new Map(newLayersTreeState));
  }

  initLayersState = initialState => {
    this.resetState(({ layersTreeState }) => {
      const { layersTree } = this.props;

      if (!layersTree) return {};

      return {
        layersTreeState: layersTreeState.size
          ? layersTreeState
          : initLayersStateAction(layersTree, initialState),
      };
    });
  }

  resetState (state, callback = () => {}) {
    const { setCurrentState } = this.props;

    this.setState(state, () => {
      callback();
      const { onChange } = this.props;
      const { layersTreeState } = this.state;
      // Simplify the state from the map
      const activeLayers = [];
      let table = null;
      layersTreeState && layersTreeState.forEach((layerState, { layers: [layerId] = [] }) => {
        if (layerState.active) {
          activeLayers.push(layerId);
        }
        if (layerState.table) {
          table = layerId;
        }
      });
      setCurrentState({ layers: activeLayers, table: table || undefined });

      onChange(layersTreeState);
    });
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
      fetchPropertyValues,
      fetchPropertyRange,
    } = this;
    const value = {
      map,
      layersTree,
      layersTreeState,
      initLayersState,
      setLayerState,
      getLayerState,
      fetchPropertyValues,
      fetchPropertyRange,
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
