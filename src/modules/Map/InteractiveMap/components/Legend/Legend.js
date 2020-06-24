import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './styles.scss';

import translateMock from '../../../../../utils/translate';
import Template from '../../../../Template/Template';
import CustomComponents from './CustomComponents';
import Circle from './components/Circle';
import Rect from './components/Rect';
import Line from './components/Line';

const DEFAULT_DIAMETER = 16;

const computeLabel = (translate, label, boundaries = {}, rounding = null) => {
  if (label && label !== '') {
    return label;
  }

  let { lower: { value: lower } = {}, upper: { value: upper } = {} } = boundaries;

  if (typeof lower === 'number') {
    if (typeof upper === 'number') { // We have two value
      if (rounding !== null) {
        lower = parseFloat(lower.toFixed(rounding)).toLocaleString();
        upper = parseFloat(upper.toFixed(rounding)).toLocaleString();
      }
      return translate('terralego.legend.label', { upper, lower });
    }
    // Only one value
    return parseFloat(lower.toFixed(rounding)).toLocaleString();
  }
  // No value
  return translate('terralego.legend.nolabel');
};

export const Legend = ({
  title,
  source,
  items,
  level,
  position,
  content,
  history,
  rounding,
  stackedCircles,
  translate,
}) => {
  const biggestDiameter = items.reduce((int, { diameter = DEFAULT_DIAMETER }) =>
    Math.max(int, diameter), 0);

  return (
    <div className={`tf-legend tf-legend--level-${level}`}>
      {title && (
        <h4 className="tf-legend__title">
          {title}
        </h4>
      )}
      <div
        className={classnames(
          'tf-legend__list',
          { 'tf-legend__stacked-circles': stackedCircles },
        )}
        // The width is multiplied by a factor 1.7 in order to provide space for the legend labels
        style={stackedCircles ? { height: biggestDiameter, width: biggestDiameter * 1.7 } : null}
      >
        {content && (
          <Template
            template={content}
            customComponents={CustomComponents}
            history={history}
          />
        )}
        {items.map(({
          label,
          template,
          source: subSource,
          color,
          items: subItems,
          shape = 'square',
          radius,
          boundaries,
          diameter = radius || DEFAULT_DIAMETER,
          ...rest
        }, index) => {
          if (subItems) {
            return (
              <Legend
                key={`${label}${items.length}`}
                title={label}
                items={subItems}
                source={subSource}
                level={level + 1}
              />
            );
          }

          if (template) {
            return (
              <Template
                key={index} // eslint-disable-line react/no-array-index-key
                template={template}
                customComponents={CustomComponents}
                history={history}
              />
            );
          }

          const computedLabel = computeLabel(
            translate,
            label,
            boundaries,
            rounding,
          );


          let Shape = null;
          const wrapperStyle = { width: DEFAULT_DIAMETER * 2 };
          const shapeProps = {
            size: DEFAULT_DIAMETER,
            color,
            ...rest,
          };

          switch (shape) {
            case 'circle':
              Shape = Circle;
              shapeProps.size = diameter;
              wrapperStyle.width = biggestDiameter;
              break;
            case 'line':
              Shape = Line;
              break;
            case 'square':
              Shape = Rect;
              break;
            default:
              break;
          }

          return (
            <div
              key={`${computedLabel}${color}${diameter}`}
              className={`tf-legend__item tf-legend__item--${shape} tf-legend__item--${position}`}
            >
              <div
                className="tf-legend__symbol-container"
                style={wrapperStyle}
              >
                {Shape && <Shape {...shapeProps} />}
              </div>
              <div className="tf-legend__label">{computedLabel}</div>
            </div>
          );
        })}
      </div>
      {source && <div className="tf-legend__source">{source}</div>}
    </div>
  );
};

Legend.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    source: PropTypes.string,
    color: PropTypes.string,
    items: PropTypes.array,
    shape: PropTypes.string,
    diameter: PropTypes.number,
    template: PropTypes.string,
  })),
  content: PropTypes.string,
  position: PropTypes.string,
  level: PropTypes.number,
  stackedCircles: PropTypes.bool,
  translate: PropTypes.func,
};
Legend.defaultProps = {
  position: 'left',
  level: 1,
  items: [],
  content: '',
  stackedCircles: false,
  translate: translateMock({
    'terralego.legend.nolabel': 'No label',
    'terralego.legend.label': 'From {{lower}} to {{upper}}',
  }),
};

export default Legend;
