import React from 'react';
import debounce from 'lodash.debounce';


const DESKTOP_BREAKPOINT = 1025;
const PHONE_BREAKPOINT = 559;

export const withDeviceSize = ({
  desktop = DESKTOP_BREAKPOINT,
  phone = PHONE_BREAKPOINT,
} = {}) => WrappedComponent => {
  class WithDeviceSize extends React.Component {
    mounted = false;

    updateWindowDimensions = debounce(() => {
      if (!this.mounted) return;

      const width = global.innerWidth;
      const newIsMobileSized = width < desktop;
      const newIsPhoneSized = width <= phone;

      this.setState(({ isMobileSized, isPhoneSized }) => {
        const newState = {};

        if (newIsMobileSized !== isMobileSized) {
          newState.isMobileSized = newIsMobileSized;
        }

        if (newIsPhoneSized !== isPhoneSized) {
          newState.isPhoneSized = newIsPhoneSized;
        }

        return newState;
      });
    }, 300);

    state = {
      isMobileSized: false,
      isPhoneSized: false,
    }

    componentDidMount () {
      this.mounted = true;
      this.updateWindowDimensions();
      global.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount () {
      this.mounted = false;
      global.removeEventListener('resize', this.updateWindowDimensions);
    }

    render () {
      const { isPhoneSized, isMobileSized } = this.state;

      return (
        <WrappedComponent
          {...this.props}
          isMobileSized={isMobileSized}
          isPhoneSized={isPhoneSized}
        />
      );
    }
  }

  const name = WrappedComponent.displayName || WrappedComponent.name;
  WithDeviceSize.displayName = `withDeviceSize(${name})`;
  return WithDeviceSize;
};


export default withDeviceSize;
