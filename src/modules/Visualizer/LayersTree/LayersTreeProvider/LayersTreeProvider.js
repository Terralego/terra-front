import React from 'react';
import PropTypes from 'prop-types';

import context from './context';
import {
  initLayersStateAction,
  selectSublayerAction,
  setLayerStateAction,
} from '../../services/layersTreeUtils';

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
     * @return {min: Number, max: Number}
     * */
    fetchPropertyRange: PropTypes.func,
  }

  static defaultProps = {
    onChange () {},
    initialState: new Map(),
    fetchPropertyValues () {},
    fetchPropertyRange () {},
  }

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
      this.resetState(initialState);
    }

    if (layersTree !== prevLayersTree) {
      this.initLayersState();
    }
  }

  componentWillUnmount () {
    this.isUnmount = true;
  }

  setLayerState = ({ layer, state: newState }) => {
    this.resetState(({ layersTreeState }) => ({
      layersTreeState: setLayerStateAction(layer, newState, layersTreeState),
    }));
  }

  getLayerState = ({ layer }) => {
    const { layersTreeState } = this.state;
    return layersTreeState.get(layer) || {};
  }

  selectSublayer = ({ layer, sublayer }) => {
    this.resetState(({ layersTreeState }) => ({
      layersTreeState: selectSublayerAction(layer, sublayer, layersTreeState),
    }));
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

  initLayersState = () => {
    this.resetState(({ layersTreeState }) => {
      const { layersTree } = this.props;

      if (!layersTree) return {};

      return {
        layersTreeState: layersTreeState.size
          ? layersTreeState
          : initLayersStateAction(layersTree),
      };
    });
  }

  resetState (state, callback = () => {}) {
    this.setState(state, () => {
      callback();
      const { onChange } = this.props;
      const { layersTreeState } = this.state;

      onChange(layersTreeState);
    });
  }

  render () {
    const {
      children,
      layersTree,
      map,
    } = this.props;
    const { layersTreeState } = this.state;
    const {
      initLayersState, setLayerState, getLayerState, selectSublayer,
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
      selectSublayer,
      fetchPropertyValues,
      fetchPropertyRange,
    };
    return (
      <Provider value={value}>
        {children}
      </Provider>
    );
  }
}

export default LayersTreeProvider;
