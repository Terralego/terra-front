import React from 'react';
import classnames from 'classnames';
import Filters, { TYPE_RANGE } from '../../../../../Forms/Filters';

const formatRange = ({ min, max, value, ...property }) => ({
  ...property,
  labelStepSize: max || 100,
  value: value || [min || 0, max || 100],
  min: min || 0,
  max: max || 100,
});

export class FiltersPanelContent extends React.Component {
  static defaultProps = {
    onRef () {},
  };

  state = {};

  elRef = React.createRef();

  componentDidMount () {
    const { onRef } = this.props;
    onRef(this.elRef.current);
  }

  componentDidUpdate ({ visible: prevVisible }) {
    const { visible } = this.props;

    if (visible !== prevVisible) {
      this.animate();
    }
  }

  componentWillUnmount () {
    this.isUnmount = true;
  }

  animate () {
    const { visible } = this.props;

    if (visible) {
      this.setState({
        animate: true,
      });
      setTimeout(() => this.isUnmount || this.setState({
        visible: true,
      }));
    } else {
      this.setState({
        visible: false,
      });
      setTimeout(() => this.isUnmount || this.setState({
        animate: false,
      }), 150);
    }
  }

  render () {
    const {
      top,
      left,
      width,
      onChange,
      layer: { filters: { form: layerForm = [] } = {} },
      activeLayer: { filters: { form = layerForm } = {} } = {},
      filtersValues,
      translate,
    } = this.props;
    const { visible, animate } = this.state;
    const { elRef } = this;

    const filters = form
      .map(filter => (filter.type === TYPE_RANGE
        ? formatRange(filter)
        : filter));

    return (
      <div
        ref={elRef}
        className={classnames('filters-panel', {
          'filters-panel--visible': visible,
          'filters-panel--animate': animate,
          'bp3-dark': true,
        })}
        style={{
          left: typeof left === 'number' && typeof width === 'number' && left + width,
        }}
      >
        <div
          className="filters-panel__arrow"
          style={{
            top,
          }}
        />
        <div className="filters-panel__content">
          <div
            className="filters-panel__header"
          >
            <h2 className="filters-panel__title">Filtrer</h2>
          </div>
          <div
            className="filters-panel__form"
          >
            <Filters
              onChange={onChange}
              filters={filters}
              properties={filtersValues}
              translate={translate}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default FiltersPanelContent;
