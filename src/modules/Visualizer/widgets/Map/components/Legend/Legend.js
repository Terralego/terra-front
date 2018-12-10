import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

export const Legend = ({ title, items }) => (
  <div className="tf-legend">
    <h4
      className="tf-legend__title"
    >
      {title}
    </h4>
    {items.map(({ label, color }) => (
      <div
        key={`${label}${color}`}
        className="tf-legend__item item"
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
    ))}
  </div>
);

Legend.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  })).isRequired,
};

export default Legend;
