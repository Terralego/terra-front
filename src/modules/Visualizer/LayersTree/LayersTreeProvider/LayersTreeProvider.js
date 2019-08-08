import React from 'react';
import PropTypes from 'prop-types';
import withHashParameters from '../../../Hash/withHashParameters';

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
    initialState: PropTypes.instanceOf(Map),
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
    getHashParameters: PropTypes.func,
    setHashParameters: PropTypes.func,
  };

  static defaultProps = {
    onChange () {},
    initialState: new Map(),
    fetchPropertyValues () {},
    fetchPropertyRange () {},
    getHashParameters () {},
    setHashParameters () {},
    translate: translateMock({
      'visualizer.layerstree.group.selector': 'No layer found',
    }),
  };

  constructor (props) {
    super(props);
    const { initialState: layersTreeState } = this.props;
    this.state = { layersTreeState };
  }

  componentDidMount () {
    this.initLayersState();
  }

  componentDidUpdate ({ initialState: prevInitialState, layersTree: prevLayersTree }) {
    const { initialState, layersTree } = this.props;

    if (initialState !== prevInitialState) {
      this.initLayersState(initialState);
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
    const { getHashParameters } = this.props;
    this.resetState(({ layersTreeState }) => {
      const { layersTree } = this.props;
      const state = initialState || layersTreeState;

      if (!layersTree) return {};

      return {
        layersTreeState: state.size
          ? state
          : initLayersStateAction(layersTree, getHashParameters()),
      };
    });
  }

  resetState (state, callback = () => {}) {
    const { setHashParameters } = this.props;

    this.setState(state, () => {
      callback();
      const { onChange } = this.props;
      const { layersTreeState } = this.state;

      // Simplify the state from the map, and send it to hash
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
      setHashParameters({ layers: activeLayers, table });

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

export default withHashParameters('layers', 'table')(LayersTreeProvider);
