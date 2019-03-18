import React from 'react';
import PropTypes from 'prop-types';
import mapBoxGl from 'mapbox-gl';
import { addMapDebug } from '../helpers/mapDebug';

import 'mapbox-gl/dist/mapbox-gl.css';

export const withMap = WrappedComponent =>
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
      fitBounds: PropTypes.arrayOf(
        PropTypes.array,
        PropTypes.array,
      ),
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
      } = this.props;

      mapBoxGl.accessToken = accessToken;

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
      });

      if (fitBounds) {
        map.fitBounds(fitBounds);
      }

      map.once('style.load', () => {
        this.setState({ map });
        onMapLoaded(map);
      });

      addMapDebug(map);
      onMapInit(map);
    }

    render () {
      const { map } = this.state;

      return (
        <div
          ref={this.containerEl}
          className="tf-map"
        >
          {map &&
            <WrappedComponent map={map} {...this.props} />
          }
        </div>
      );
    }
  };

export default withMap;
