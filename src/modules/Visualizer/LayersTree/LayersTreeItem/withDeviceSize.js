import React from 'react';


const DESKTOP_BREAKPOINT = 1025;
const PHONE_BREAKPOINT = 559;

export const withDeviceSize = ({
  desktop = DESKTOP_BREAKPOINT,
  phone = PHONE_BREAKPOINT,
} = {}) => WrappedComponent =>
  class WithDeviceSize extends React.Component {
    componentDidMount () {
      this.updateWindowDimensions();
      global.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount () {
      global.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
      this.forceUpdate();
    };

    render () {
      const { ...props } = this.props;
      const width = global.innerWidth;

      return (
        <WrappedComponent
          {...props}
          isMobileSized={width < desktop}
          isPhoneSized={width <= phone}
        />
      );
    }
  };

export default withDeviceSize;
