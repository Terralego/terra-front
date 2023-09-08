import React from 'react';
import ReactDOM from 'react-dom';

import FeatureLength from '@turf/length';
import FeatureArea from '@turf/area';
import LineToPolygon from '@turf/line-to-polygon';
import { Button } from '@blueprintjs/core';

import {
  wrapperStyle,
  drawButtonStyle,
  measureStyle,
  measureListStyle,
  numStyle,
  unitStyle,
  closeMeasureStyle,
} from './controlStyles';

import rule from '../../../../../images/rule.svg';

const formatNumber = num => num.toLocaleString(
  undefined,
  { maximumFractionDigits: 3, minimumFractionDigits: 3 },
);

function CustomDrawControlComponent ({ draw }) {
  const [feature] = draw.getAll().features;
  const mode = draw.getMode();
  const drawing = mode === 'draw_line_string';

  let length = 0;
  try {
    length = FeatureLength(feature);
  } catch (err) {
    // console.error(err);
  }

  let area = 0;
  try {
    area = FeatureArea(LineToPolygon(feature));
  } catch (err) {
    // console.error(err);
  }

  const close = () => {
    draw.deleteAll();
    draw.changeMode('simple_select');
  };

  const enable = () => {
    draw.deleteAll();
    draw.changeMode('draw_line_string');
  };

  const display = Boolean(length || area || drawing);

  return (
    <div style={wrapperStyle}>
      <Button onClick={enable} disabled={drawing} style={drawButtonStyle}>
        <img src={rule} alt="Mesurer" style={{ width: 20, height: 'auto' }} />
      </Button>

      {display && (
        <div style={measureStyle}>
          {!(length || area) && 'Commencez à tracer'}

          {Boolean(length || area) && (
            <dl style={measureListStyle}>
              {Boolean(length) && (
                <>
                  <dt>Distance :</dt>

                  <dd style={numStyle}>
                    {formatNumber(length * 1000)}
                    <span style={unitStyle}>m</span>
                  </dd>
                  <dd style={numStyle}>
                    {formatNumber(length)}
                    <span style={unitStyle}>km</span>
                  </dd>
                </>
              )}

              {Boolean(area) && (
                <>
                  <dt>Surface :</dt>

                  <dd style={numStyle}>
                    {formatNumber(area / 10000)}
                    <span style={unitStyle}>ha</span>
                  </dd>
                  <dd style={numStyle}>
                    {formatNumber(area / 1000000)}
                    <span style={unitStyle}>km²</span>
                  </dd>
                </>
              )}
            </dl>
          )}
        </div>
      )}

      {display && (
        <Button icon="cross" onClick={close} style={closeMeasureStyle} />
      )}
    </div>
  );
}

export default class MeasureControl {
  onAdd = localMap => {
    this.map = localMap;
    this.container = document.createElement('div');
    return this.container;
  }

  onRemove = () => {
    ReactDOM.unmountComponentAtNode(this.container);
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }

  renderContainer (drawInstance) {
    ReactDOM.render(<CustomDrawControlComponent draw={drawInstance} />, this.container);
  }
}
