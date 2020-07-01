import React, { useState, useEffect, useCallback } from 'react';
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

const Story = ({ map, story: { beforeEach = [], slides }, setLegends }) => {
  const [step, setStep] = useState(0);

  const slideCount = slides.length - 1;

  useEffect(() => {
    if (!map) return;
    const { layouts = [], legends } = slides[step];
    beforeEach.forEach(resetLayers(map));
    layouts.forEach(toggleLayers(map));
    setLegends(legends);
  }, [map, beforeEach, setLegends, slides, step]);

  const previousStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const nextStep = useCallback(() => {
    setStep(prevStep => (prevStep === slideCount
      ? 0
      : prevStep + 1));
  }, [slideCount]);

  const { title, content } = slides[step];

  const displayPrevButton = step > 0;
  const displayButtons = slideCount > 0;

  const getNextLabel = () => {
    if (step === 0) {
      return 'Démarrer';
    }
    if (step === slideCount) {
      return 'Recommencer';
    }
    return 'Suivant';
  };

  return (
    <div className="storytelling">
      <div className="storytelling__content">
        <h2>{title}</h2>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      {displayButtons && (
        <div className={classnames('storytelling__buttons', { 'storytelling__buttons--justified': displayPrevButton })}>
          {displayPrevButton && (
            <Button icon="chevron-left" onClick={previousStep} large>Précédent</Button>
          )}

          <Button
            rightIcon={step !== slideCount && 'chevron-right'}
            icon={step === slideCount && 'step-backward'}
            large
            intent={Intent.PRIMARY}
            onClick={nextStep}
          >
            {getNextLabel()}
          </Button>
        </div>
      )}
    </div>
  );
};

Story.propTypes = {
  map: PropTypes.shape({}),
  story: PropTypes.shape({
    beforeEach: PropTypes.arrayOf(PropTypes.shape({
      layers: PropTypes.arrayOf(PropTypes.string),
      active: PropTypes.bool,
    })),
    slides: PropTypes.arrayOf(PropTypes.shape({
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
    })),
  }).isRequired,
};

Story.defaultProps = {
  map: undefined,
};

export default Story;
