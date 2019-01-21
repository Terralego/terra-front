import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

export const Legend = ({ title, items, level = 1 }) => (
  <div className={`tf-legend tf-legend--level-${level}`}>
    <h4
      className="tf-legend__title"
    >
      {title}
    </h4>
    {items.map(({ label, color, items: subItems, shape = 'square' }) => (
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
            className={`tf-legend__item item item--${shape}`}
          >
            <div
              className="item__before"
              style={{ backgroundColor: color }}
            />
            <div className="item__label">
              {label}
            </div>
            <div
              className="item__after"
              style={{ backgroundColor: color }}
            />
          </div>
        )))}
  </div>
);

Legend.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    color: PropTypes.string,
    items: PropTypes.array,
    shape: PropTypes.string,
  })).isRequired,
};

export default Legend;
