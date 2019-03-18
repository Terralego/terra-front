import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const DEFAULT_RADIUS = 16;

export const Legend = props => {
  const { title, items, level, position } = props;
  const biggestRadius = items.reduce((int, item) =>
    Math.max(int, item.radius || DEFAULT_RADIUS), 0);

  return (
    <div className={`tf-legend tf-legend--level-${level}`}>
      <h4
        className="tf-legend__title"
      >
        {title}
      </h4>
      <div className="tf-legend__list">
        {items.map(({ label, color, items: subItems, shape = 'square', radius = DEFAULT_RADIUS }) => (
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
                    height: shape === 'circle' ? biggestRadius : DEFAULT_RADIUS * 2,
                  }}
                >
                  <div
                    className="tf-legend__symbol"
                    style={{
                      backgroundColor: color,
                      width: shape === 'circle' ? radius : DEFAULT_RADIUS,
                      height: shape === 'circle' ? radius : DEFAULT_RADIUS,
                    }}
                  />
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
    color: PropTypes.string,
    items: PropTypes.array,
    shape: PropTypes.string,
    radius: PropTypes.number,
  })).isRequired,
  position: PropTypes.string,
  level: PropTypes.number,
};
Legend.defaultProps = {
  position: 'left',
  level: 1,
};

export default Legend;
