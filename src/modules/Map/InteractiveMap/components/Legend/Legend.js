import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './styles.scss';

import Template from '../../../../Template/Template';
import CustomComponents from './CustomComponents';
import Circle from './components/Circle';
import Rect from './components/Rect';

const DEFAULT_DIAMETER = 16;

export const Legend = ({
  title,
  source,
  items,
  level,
  position,
  content,
  history,
  stackedCircles,
}) => {
  const biggestDiameter = items.reduce((int, item) =>
    Math.max(int, item.diameter || DEFAULT_DIAMETER), 0);

  return (
    <div className={`tf-legend tf-legend--level-${level}`}>
      <h4
        className="tf-legend__title"
      >
        {title}
      </h4>
      <div
        className={classnames(
          'tf-legend__list',
          { 'tf-legend__stacked-circles': stackedCircles },
        )}
        style={stackedCircles ? { height: biggestDiameter } : null}
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
          diameter = radius || DEFAULT_DIAMETER,
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

          return (
            <div
              key={`${label}${color}`}
              className={`tf-legend__item tf-legend__item--${shape} tf-legend__item--${position}`}
            >
              <div
                className="tf-legend__symbol-container"
                style={{ width: shape === 'circle' ? biggestDiameter : DEFAULT_DIAMETER * 2 }}
              >
                {shape === 'circle'
                  ? <Circle color={color} size={diameter} />
                  : <Rect color={color} size={DEFAULT_DIAMETER} />}
              </div>
              <div className="tf-legend__label">{label}</div>
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
};
Legend.defaultProps = {
  position: 'left',
  level: 1,
  items: [],
  content: '',
  stackedCircles: false,
};

export default Legend;
