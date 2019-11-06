import React from 'react';
import PropTypes from 'prop-types';
import mapBoxGl from 'mapbox-gl';
import { addMapDebug } from '../helpers/mapDebug';

import 'mapbox-gl/dist/mapbox-gl.css';

export const withMap = WrappedComponent => {
  class WithMap extends React.Component {
    static propTypes = {
      backgroundStyle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          // See mapboxgl style API
          // https://www.mapbox.com/mapbox-gl-js/style-spec/
        }),
      ]).isRequired,
      zoom: PropTypes.number,
      fitBounds: PropTypes.shape({
        coordinates: PropTypes.arrayOf(
          PropTypes.array,
        ),
        padding: PropTypes.shape({
          top: PropTypes.number,
          bottom: PropTypes.number,
          left: PropTypes.number,
          right: PropTypes.number,
        }),
        offset: PropTypes.arrayOf(
          PropTypes.number,
        ),
      }),
      onMapInit: PropTypes.func,
      onMapLoaded: PropTypes.func,
      onMapUpdate: PropTypes.func,
    };

    static defaultProps = {
      zoom: 9,
      fitBounds: null,
      onMapInit () {},
      onMapLoaded () {},
      onMapUpdate () {},
    };

    state = {
      map: null,
    };

    containerEl = React.createRef();

    componentDidMount () {
      this.initMap();
    }

    componentWillUnmount () {
      this.isUnmount = true;
    }

    get map () {
      const { map } = this.state;
      return map;
    }

    initMap () {
      const {
        accessToken,
        backgroundStyle: style,
        center,
        zoom,
        maxZoom,
        minZoom,
        maxBounds,
        fitBounds,
        onMapInit,
        onMapLoaded,
        hash,
      } = this.props;

      mapBoxGl.accessToken = accessToken;

      const hasHash = hash && !!global.location.hash;

      const map = new mapBoxGl.Map({
        container: this.containerEl.current,
        attributionControl: false,
        style,
        center,
        zoom,
        maxZoom,
        minZoom,
        maxBounds,
        // below fix Firefox bug for printing http://fuzzytolerance.info/blog/2016/07/01/Printing-Mapbox-GL-JS-maps-in-Firefox/
        preserveDrawingBuffer: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
        hash,
      });

      // This allows accessing MapboxGL instance from console (needed for e2e tests)
      if (this.containerEl.current) {
        this.containerEl.current.mapboxInstance = map;
      }

      if (!hasHash && fitBounds) {
        const { coordinates, ...fitBoundsParams } = fitBounds;
        map.fitBounds(coordinates, fitBoundsParams);
      }

      map.once('style.load', () => {
        if (this.isUnmount) return;

        this.setState({ map });
        onMapLoaded(map);
      });

      addMapDebug(map);
      onMapInit(map);
    }

    render () {
      const { className, ...props } = this.props;
      const { map } = this.state;

      return (
        <div
          ref={this.containerEl}
          className={`tf-map ${className}`}
        >
          {map &&
            <WrappedComponent map={map} {...props} />
          }
        </div>
      );
    }
  }
  const name = WrappedComponent.displayName || WrappedComponent.name;
  WithMap.displayName = `withMap(${name})`;

  return WithMap;
};

export default withMap;
