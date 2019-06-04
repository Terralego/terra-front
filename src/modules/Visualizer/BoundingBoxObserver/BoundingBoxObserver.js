import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export class BoundingBoxObserver extends React.Component {
  static defaultProps = {
    onChange () {},
    as: 'div',
  };

  ref = React.createRef();

  componentDidMount () {
    this.ro = new ResizeObserver(([{ target }]) => {
      const { onChange } = this.props;
      onChange(target.getBoundingClientRect());
    });
    this.ro.observe(this.ref.current);
  }

  componentWillUnmount () {
    this.ro.disconnect();
  }

  render () {
    const { as: Component, children, ...props } = this.props;
    const { ref } = this;

    if (typeof children === 'function') {
      return (
        children({ ref })
      );
    }

    return (
      <Component ref={ref} {...props}>
        {children}
      </Component>
    );
  }
}

export default BoundingBoxObserver;
