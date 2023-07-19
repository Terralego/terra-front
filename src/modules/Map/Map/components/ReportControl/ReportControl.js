import React from 'react';
import { Icon, Position, Toaster } from '@blueprintjs/core';
import { Marker } from 'maplibre-gl';
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
    window.addEventListener('hashchange', this.setReportMarker);
  }

  componentWillUnmount () {
    const { map } = this.props;
    if (this.marker) {
      this.marker.remove();
    }
    map.off('click', this.toggleReport);
    map.off('load', this.setReportMarker);
    map.off('mousemove', this.forceCrosshairCursor);
    window.removeEventListener('hashchange', this.setReportMarker);
  }

  forceCrosshairCursor = e => {
    e.target.getCanvas().style.cursor = 'crosshair';
  }

  setReportMarker = () => {
    const { report, map: mapHash } = parse(window.location.hash);
    if (!report) {
      return;
    }
    const { initialState, map } = this.props;
    // clean url from report param, only used to set marker
    // avoiding later confusion
    delete initialState.report;
    window.location.hash = `#${stringify(initialState, this.options)}`;

    const [_zoom, lat, lng] = mapHash.split('/'); // eslint-disable-line no-unused-vars
    if (!this.marker) {
      this.marker = new Marker();
    }
    this.marker
      .setLngLat({ lat: Number(lat), lng: Number(lng) })
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
  }

  displayToaster = message => {
    const toaster = Toaster.create({
      className: 'report-toast',
      position: Position.TOP,
    });
    toaster.show({ message });
  }

  onToggleReport = () => {
    const {
      map,
      setInteractionsEnable,
      translate: t,
    } = this.props;

    // allowing just one click, prevent some conflict
    map.once('click', this.toggleReport);
    map.on('mousemove', this.forceCrosshairCursor);
    setInteractionsEnable(false);
    this.displayToaster(t('terralego.map.report_control.toaster'));
  }

  onStopReport = () => {
    const {
      map,
      setInteractionsEnable,
    } = this.props;
    map.off('click', this.toggleReport);
    map.off('mousemove', this.forceCrosshairCursor);
    this.marker.remove();
    this.setState({ isReporting: false, coordinates: null, url: null });
    setInteractionsEnable(true);
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
