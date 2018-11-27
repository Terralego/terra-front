import React from 'react';
import PropTypes from 'prop-types';
import mapBoxGl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const withMap = WrappedComponent =>
  class WithMap extends React.Component {
    static propTypes = {
      styles: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          // See mapboxgl style API
          // https://www.mapbox.com/mapbox-gl-js/style-spec/
        }),
      ]).isRequired,
      zoom: PropTypes.number,
    };

    static defaultProps = {
      zoom: 9,
    };

    state = {
      map: null,
    };

    componentDidMount () {
      this.initMap();
    }

    containerEl = React.createRef();

    initMap () {
      const {
        accessToken,
        styles: style,
        center,
        zoom,
        maxZoom,
        minZoom,
        maxBounds,
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
        bearing: 0,
      });
      map.once('data', () => this.setState({ map }));
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