import React from 'react';
import ReactDOM from 'react-dom';

export class AbstractMapControl extends React.Component {
  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group'

  static Container = 'div';

  onAdd (map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = this.constructor.containerClassName;
    this.renderContainer();
    return this.container;
  }

  onRemove () {
    ReactDOM.unmountComponentAtNode(this.container);
    this.container.parentNode.removeChild(this.container);
    delete this.map;
  }

  setProps (props) {
    this.props = this.props || {};
    Object.keys(props).forEach(key => {
      this.props[key] = props[key];
    });
    this.renderContainer();
  }

  renderContainer () {
    const { constructor: Container } = this;
    ReactDOM.render(
      <Container
        container={this.container}
        {...this.props}
      />,
      this.container,
    );
  }
}

export default AbstractMapControl;
