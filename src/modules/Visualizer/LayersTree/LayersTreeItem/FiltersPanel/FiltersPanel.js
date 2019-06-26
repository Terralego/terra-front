import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import FiltersPanelContent from './FiltersPanelContent';
import './styles.scss';

export class FiltersPanel extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    onMount: PropTypes.func,
    setLayerState: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    onMount () {},
    setLayerState () {},
  };

  containerRef = React.createRef();

  componentDidMount () {
    const { onMount } = this.props;
    const { panelContentRef = {}, containerRef } = this;
    onMount([panelContentRef.current, containerRef.current]);
  }

  getPosition () {
    const { containerRef: { current: container } } = this;
    if (!container) return {};
    const { top, left, width, height } = container.getBoundingClientRect();
    return { top, left, width, height };
  }

  getPanelRef = ref => {
    this.panelContentRef = { current: ref };
  }

  handleChange = filters => {
    const { setLayerState, layer } = this.props;
    setLayerState({ layer, state: { filters } });
  }

  render () {
    const { visible, children, ...props } = this.props;
    const { containerRef, getPanelRef, handleChange } = this;

    const position = this.getPosition();

    const portal = ReactDOM.createPortal(
      <FiltersPanelContent
        onRef={getPanelRef}
        visible={visible}
        onChange={handleChange}
        {...props}
        {...position}
      />,
      document.body,
    );
    return (
      <div ref={containerRef}>
        {children}
        {portal}
      </div>
    );
  }
}

export default FiltersPanel;
