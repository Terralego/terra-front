import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

import Template from '../../../../Template/Template';
import CustomComponents from './CustomComponents';
import Circle from './components/Circle';
import Rect from './components/Rect';

const DEFAULT_RADIUS = 16;

export const Legend = ({ title, items, level, position, content, history }) => {
  const biggestRadius = items.reduce((int, item) =>
    Math.max(int, item.radius || DEFAULT_RADIUS), 0);

  const isTemplate = !!content;

  return (
    <div className={`tf-legend tf-legend--level-${level}`}>
      <h4
        className="tf-legend__title"
      >
        {title}
      </h4>
      <div className="tf-legend__list">
        {isTemplate
          ? (
            <Template
              template={content}
              customComponents={CustomComponents}
              history={history}
            />
          )
          : items.map(({ label, color, items: subItems, shape = 'square', radius = DEFAULT_RADIUS }) => (
            subItems
              ? (
                <Legend
                  key={`${label}${items.length}`}
                  title={label}
                  items={subItems}
                  level={level + 1}
                />
              ) : (
                <div
                  key={`${label}${color}`}
                  className={`tf-legend__item tf-legend__item--${shape} tf-legend__item--${position}`}
                >
                  <div
                    className="tf-legend__symbol-container"
                    style={{
                      width: shape === 'circle' ? biggestRadius : DEFAULT_RADIUS * 2,
                    }}
                  >
                    {shape === 'circle'
                      ? <Circle color={color} size={radius} />
                      : <Rect color={color} size={DEFAULT_RADIUS} />}
                  </div>
                  <div
                    className="tf-legend__label"
                  >
                    {label}
                  </div>
                </div>
              )))}
      </div>
    </div>
  );
};

Legend.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    fill: PropTypes.string,
    items: PropTypes.array,
    shape: PropTypes.string,
    radius: PropTypes.number,
  })),
  content: PropTypes.string,
  position: PropTypes.string,
  level: PropTypes.number,
};
Legend.defaultProps = {
  position: 'left',
  level: 1,
  items: [],
  content: '',
};

export default Legend;
