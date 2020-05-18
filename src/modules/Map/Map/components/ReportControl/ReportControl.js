import React from 'react';
import { Icon, Position, Toaster } from '@blueprintjs/core';
import { Marker } from 'mapbox-gl';
import { parse, stringify } from 'query-string';
import AbstractControl from '../../../helpers/AbstractMapControl';
import Tooltip from '../../../../../components/Tooltip';
import ReportCard from './ReportCard';
import { DEFAULT_OPTIONS } from '../../../../State/Hash/withHashState';


export default class ReportControl extends AbstractControl {
  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-report';

  options = DEFAULT_OPTIONS

  constructor (props) {
    super(props);
    this.state = {
      isReporting: false,
      coordinates: null,
      url: null,
    };
  }

  componentDidMount () {
    const { map } = this.props;
    map.on('load', this.setReportMarker);
    // accessing the url with new params, when map is loaded, trigger a move
    map.on('move', this.setReportMarker);
  }

  componentWillUnmount () {
    const { map } = this.props;
    if (this.marker) {
      this.marker.remove();
    }
    map.off('click', this.toggleReport);
    map.off('load', this.setReportMarker);
    map.off('move', this.setReportMarker);
  }

  setReportMarker = () => {
    const currentHash = window.location.href.split('#')[1];
    const fromReport = parse(currentHash).report;
    if (!fromReport) {
      return;
    }

    const { map } = this.props;
    const mapHash = parse(currentHash).map;
    const [lat, lng] = mapHash.split('/').splice(1, 2); // do not need the zoom at index 0
    if (!this.marker) {
      this.marker = new Marker();
    }
    this.marker
      .setLngLat({ lat: parseFloat(lat), lng: parseFloat(lng) })
      .addTo(map);
  }

  generateHashString = ({ lng, lat, zoom }) => {
    const { initialState, url: baseUrl } = this.props;
    initialState.map = `${zoom}/${lat}/${lng}`;
    initialState.report = true;
    const url = `${baseUrl}#${stringify(initialState, this.options)}`;
    return url;
  }

  toggleReport = ({ lngLat }) => {
    const { map } = this.props;
    const coordinates = lngLat;
    if (!this.marker) {
      this.marker = new Marker();
    }
    this.marker.setLngLat(coordinates).addTo(map);
    const url = this.generateHashString({ ...coordinates, zoom: map.getZoom() });
    this.setState({
      coordinates,
      isReporting: true,
      url,
    });

    // allowing just one click, prevent some conflict
    map.off('click', this.toggleReport);
  }

  displayToaster = message => {
    const toaster = Toaster.create({
      className: 'report-toast',
      position: Position.TOP,
    });
    toaster.show({ message });
  }

  onToggleReport = () => {
    const { map, translate: t } = this.props;
    map.on('click', this.toggleReport);
    this.displayToaster(t('terralego.map.report_control.toaster'));
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
    const { url, isReporting, coordinates = {} } = this.state;
    const { submitReport, translate: t } = this.props;


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
          reportUrl={url}
        />
        <Tooltip
          content={t('terralego.map.report_control.content')}
        >
          <button
            type="button"
            onClick={this.onToggleReport}
          >
            <Icon icon="error" />
          </button>
        </Tooltip>
      </>
    );
  }
}
