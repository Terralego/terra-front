import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Intent } from '@blueprintjs/core';
import { toggleLayerVisibility } from '../../Map/services/mapUtils';

import './styles.scss';

const toggleLayers = map => ({ layers, active }) =>
  layers.forEach(layerId =>
    toggleLayerVisibility(map, layerId, active ? 'visible' : 'none'));

const resetLayers = map => ({ layers = [] }) => {
  const { layers: allLayers } = map.getStyle();
  toggleLayers(map)({
    layers: allLayers
      .filter(({ id }) => layers.includes(id))
      .map(({ id }) => id),
    active: false,
  });
};

export class Story extends React.Component {
  static propTypes = {
    story: PropTypes.arrayOf(PropTypes.shape({
      beforeEach: PropTypes.arrayOf(PropTypes.shape({
        layers: PropTypes.arrayOf(PropTypes.string),
        active: PropTypes.bool,
      })),
      slides: PropTypes.shape({
        title: PropTypes.string,
        content: PropTypes.string,
        layouts: PropTypes.arrayOf(PropTypes.shape({
          layers: PropTypes.arrayOf(PropTypes.string),
          active: PropTypes.bool,
        })),
        legends: PropTypes.arrayOf(PropTypes.shape({
          title: PropTypes.string,
          items: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            color: PropTypes.string,
          })),
        })),
      }),
    })).isRequired,
  }

  state = {
    step: 0,
  }

  componentDidMount () {
    this.initMap();
  }

  componentDidUpdate ({ map: prevMap }, { step: prevStep }) {
    const { map } = this.props;
    const { step } = this.state;

    if (map !== prevMap) {
      this.initMap();
    }

    if (map !== prevMap
        || step !== prevStep) {
      this.displayStep();
    }
  }

  prevStep = () => {
    const { story: { slides } } = this.props;
    this.setState(({ step: prevStep }) => ({ step: prevStep === 0
      ? slides.length - 1
      : prevStep - 1 }));
  }

  nextStep = () => {
    const { story: { slides } } = this.props;
    this.setState(({ step: prevStep }) => ({ step: prevStep + 1 === slides.length
      ? 0
      : prevStep + 1 }));
  }

  initMap () {
    const { map } = this.props;

    if (!map) return;

    this.displayStep();
  }

  displayStep () {
    const { map, story: { beforeEach = [], slides }, setLegends } = this.props;
    const { step } = this.state;

    if (!map) return;

    const { layouts = [], legends } = slides[step];
    beforeEach.forEach(resetLayers(map));
    layouts.forEach(toggleLayers(map));
    setLegends(legends);
  }

  render () {
    const { story: { slides } } = this.props;
    const { step } = this.state;
    const { nextStep, prevStep } = this;
    const { title, content } = slides[step];
    const displayPrevButton = step > 0;

    return (
      <div className="storytelling">
        <div className="storytelling__content">
          <h2>{title}</h2>
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <div className={classnames('storytelling__buttons', { 'storytelling__buttons--justified': displayPrevButton })}>
          {displayPrevButton
            && (
            <Button
              icon="chevron-left"
              onClick={prevStep}
              large
            >
              Précédent
            </Button>
            )
          }

          <Button
            rightIcon={step === slides.length - 1 ? undefined : 'chevron-right'}
            icon={step === slides.length - 1 ? 'step-backward' : undefined}
            large
            intent={Intent.PRIMARY}
            onClick={nextStep}
          >
            {step === 0 && 'Démarrer'}
            {step > 0 && step < slides.length - 1 && 'Suivant'}
            {step === slides.length - 1 && 'Recommencer'}
          </Button>
        </div>
        &nbsp;
      </div>
    );
  }
}

export default Story;
