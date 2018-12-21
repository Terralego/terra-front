import React from 'react';

import Map from '../../../../../modules/Map/Map';

const STEPS = [
  [4.8577, 43.9856],
  [4.8860, 43.9180],
  [4.7751, 43.9249],
  [4.9246, 43.9840],
  [4.8807, 44.0352],
  [4.9027, 43.9064],
  [4.8624, 43.9830],
  [4.7836, 43.9220],
  [4.8996, 43.9071],
  [4.8085, 43.9473],
];

class FlyOver extends React.Component {
  state = {};

  componentDidMount () {
    this.interval = setInterval(() => this.updatePosition(), 2000);
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  getNextStep () {
    const { currentStep } = this.state;
    const pos = STEPS.indexOf(currentStep);
    if (pos === -1 || pos + 1 === STEPS.length) {
      return STEPS[0];
    }
    return STEPS[pos + 1];
  }

  updatePosition () {
    const nextStep = this.getNextStep();
    this.setState({ currentStep: nextStep });
  }

  render () {
    const { currentStep } = this.state;
    const flyTo = {
      center: currentStep,
      speed: 0.2,
      zoom: 14,
      curve: 1,
    };

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <Map
          accessToken="pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ"
          backgroundStyle="mapbox://styles/mapbox/light-v9"
          center={[5.3833, 43.9]}
          zoom={10}
          minZoom={6}
          maxZoom={17}
          maxBounds={[[1.0, 42.6], [8.2, 46.6]]}
          flyTo={flyTo}
        />
      </div>
    );
  }
}

export default () => <FlyOver />;
