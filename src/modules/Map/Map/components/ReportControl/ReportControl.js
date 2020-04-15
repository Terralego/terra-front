import React from 'react';
import { Button, Icon } from '@blueprintjs/core';

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

  toggleReport = e => {
    this.setState({
      coordinates: e.lngLat,
      isReporting: true,
      url: 'test/url/for/now',
    });
  }

  onToggleReport = () => {
    const { map } = this.props;
    map.on('click', this.toggleReport);
  }

  stopReport = () => {
    const { map } = this.props;
    map.off('click', this.toggleReport);
    this.setState({ isReporting: false, coordinates: null, url: null });
  }

  onNewReport = () => {
    this.stopReport();
    this.onToggleReport();
  }

  render () {
    const { isReporting, coordinates } = this.state;
    const { submitReport } = this.props;

    return (
      <>
        <ReportCard
          isOpen={isReporting}
          cancelReport={this.stopReport}
          endReport={this.stopReport}
          newReport={this.onNewReport}
          onSubmit={submitReport}
          coordinates={coordinates}
        />
        <Tooltip>
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
