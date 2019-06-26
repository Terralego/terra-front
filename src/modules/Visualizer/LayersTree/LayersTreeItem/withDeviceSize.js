import React from 'react';

export const withDeviceSize = WrappedComponent =>
  class WithDeviceSize extends React.Component {
    state = {
      width: 0,
      height: 0,
    };

    componentDidMount () {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount () {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    render () {
      const { ...props } = this.props;
      const { width, height } = this.state;

      return (
        <WrappedComponent
          {...props}
          windowWidth={width}
          windowHeight={height}
          isTabletSized={width < 1025}
          isMobileSize={width < 321}
        />
      );
    }
  };

export default withDeviceSize;
