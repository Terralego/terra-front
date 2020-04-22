import React from 'react';
import { Button, Icon } from '@blueprintjs/core';
import { Marker } from 'mapbox-gl';

import AbstractControl from '../../../helpers/AbstractMapControl';
import Tooltip from '../../../../../components/Tooltip';
import ReportCard from './ReportCard';


export default class ReportControl extends AbstractControl {
  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-report';

  constructor (props) {
    super(props);
    this.state = {
      isReporting: false,
      coordinates: null,
      url: null,
    };
  }

  componentDidMount () {
    const {
      fromReport,
      map,
      reportCoords: { lat, lng },
    } = this.props;
    if (fromReport) {
      const coords = { lat: parseFloat(lat), lng: parseFloat(lng) };
      map.on('load', () => {
        this.reportMarker = new Marker()
          .setLngLat(coords)
          .addTo(map);
        map.flyTo({ center: coords });
      });
    }
  }

  componentWillUnmount () {
    if (this.reportMarker) {
      this.reportMarker.remove();
    }
  }

  toggleReport = e => {
    const { url, map } = this.props;
    const coordinates = e.lngLat;
    this.marker = new Marker().setLngLat(coordinates).addTo(this.props.map);
    this.setState({
      coordinates,
      isReporting: true,
      url,
    });

    // allowing just one click, prevent some conflict
    map.off('click', this.toggleReport);
  }

  onToggleReport = () => {
    const { map } = this.props;
    map.on('click', this.toggleReport);
  }

  onStopReport = () => {
    const { map } = this.props;
    map.off('click', this.toggleReport);
    this.marker.remove();
    this.setState({ isReporting: false, coordinates: null, url: null });
  }

  onNewReport = () => {
    this.onStopReport();
    this.onToggleReport();
  }

  render () {
    const { isReporting, coordinates = {} } = this.state;
    const { submitReport, translate: t, url } = this.props;

    return (
      <>
        <ReportCard
          isOpen={isReporting}
          cancelReport={this.onStopReport}
          endReport={this.onStopReport}
          newReport={this.onNewReport}
          onSubmit={submitReport}
          coordinates={coordinates}
          translate={t}
          reportUrl={coordinates && `${url}/${coordinates.lng}/${coordinates.lat}`}
        />
        <Tooltip
          content={t('terralego.map.report_control.content')}
        >
          <Button
            onClick={this.onToggleReport}
          >
            <Icon icon="error" />
          </Button>
        </Tooltip>
      </>
    );
  }
}
