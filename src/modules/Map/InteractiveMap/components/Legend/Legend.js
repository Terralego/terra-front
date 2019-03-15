import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

export const Legend = props => {
  const { title, items, level, position } = props;
  const biggerRadius = items.filter((int, item) => Math.max(int, item.radius), 0);

  return (
    <div className={`tf-legend tf-legend--level-${level}`}>
      <h4
        className="tf-legend__title"
      >
        {title}
      </h4>
      <div className="tf-legend__list">
        {items.map(({ label, color, items: subItems, shape = 'square', radius }) => (
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
                className={`tf-legend__item item--${shape} item--${position}`}
              >
                <div
                  className="item__symbol-container"
                  style={{ height: `${biggerRadius}px`, margin: '0.5rem' }}
                >
                  <div
                    className="item__symbol"
                    style={{ backgroundColor: color, width: radius, height: radius }}
                  />
                </div>
                <div
                  className="item__label"
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
