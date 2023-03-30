import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { readableColor, readableColorIsBlack } from 'color2k';
import './styles.scss';

import translateMock from '../../../../../utils/translate';
import Circle from './components/Circle';
import Rect from './components/Rect';
import Line from './components/Line';
import Icon from './components/Icon';

const DEFAULT_SIZE = 16;

const computeLabel = (
  translate,
  label,
  boundaries = {},
  rounding = null,
  isFirst,
  isLast,
) => {
  if (label && label !== '') {
    return label;
  }

  let {
    lower: { value: lower } = {},
    upper: { value: upper } = {},
  } = boundaries;

  if (typeof lower === 'number') {
    if (typeof upper === 'number') {
      // We have two value
      if (rounding !== null) {
        lower = parseFloat(lower.toFixed(rounding)).toLocaleString();
        upper = parseFloat(upper.toFixed(rounding)).toLocaleString();
      }
      if (isFirst) {
        return translate('terralego.legend.labelFirst', { upper, lower });
      }
      if (isLast) {
        return translate('terralego.legend.labelLast', { upper, lower });
      }
      return translate('terralego.legend.label', { upper, lower });
    }
    // Only one value
    return parseFloat(lower.toFixed(rounding)).toLocaleString();
  }
  if (lower === null && upper === null) {
    return translate('terralego.legend.labelNoValue');
  }
  // No value
  return translate('terralego.legend.nolabel');
};

export const Legend = ({
  title,
  comment,
  shape,
  items,
  position,
  rounding,
  translate,
}) => {
  const biggestSize = Math.max(...items.map(({ size = DEFAULT_SIZE }) => size));

  const isStackedCircles = shape === 'stackedCircle';

  return (
    <div className="tf-legend tf-legend--level-1">
      {title && <h4 className="tf-legend__title">{title}</h4>}
      <div
        className={classnames('tf-legend__list', {
          'tf-legend__stacked-circles': isStackedCircles,
        })}
        // HACK: The width is multiplied by a factor 1.9 in order to provide
        // space for the legend labels
        style={
          isStackedCircles
            ? { height: biggestSize, width: biggestSize * 1.9 }
            : undefined
        }
      >
        {items.map(
          (
            {
              label,
              color,
              boundaries,
              size = DEFAULT_SIZE,
              ...rest
            },
            index,
          ) => {
            const computedLabel = computeLabel(
              translate,
              label,
              boundaries,
              rounding,
              index === 0,
              index === items.length - 1 ||
                (index === items.length - 2 && // Last value excluding null value legend
                  items[items.length - 1].boundaries &&
                  items[items.length - 1].boundaries.lower.value === null &&
                  items[items.length - 1].boundaries.upper.value === null),
            );

            let Shape = null;
            const wrapperStyle = { width: DEFAULT_SIZE * 2 };
            const shapeProps = {
              size,
              color,
              ...rest,
            };

            switch (shape) {
              case 'stackedCircle':
                if (!shapeProps.strokeColor) {
                  // Stroke color must be contrasted
                  shapeProps.strokeColor = readableColor(color);
                }
              // eslint-disable-next-line no-fallthrough
              case 'circle':
                Shape = Circle;
                shapeProps.size = size;
                wrapperStyle.width = biggestSize;
                break;
              case 'line':
                Shape = Line;
                break;
              case 'square':
                Shape = Rect;
                break;
              case 'icon':
                Shape = Icon;
                wrapperStyle.position = 'relative';
                break;
              default:
                break;
            }

            return (
              <div
                key={`${computedLabel}${color}${size}`}
                className={`tf-legend__item tf-legend__item--${shape} tf-legend__item--${position}`}
              >
                <div
                  className={classnames('tf-legend__symbol-container', {
                    'color--black': readableColorIsBlack(color || '#FFFFFF'),
                  })}
                  style={wrapperStyle}
                >
                  {Shape && <Shape {...shapeProps} />}
                </div>
                <div className="tf-legend__label">{computedLabel}</div>
              </div>
            );
          },
        )}
      </div>
      {comment && <div className="tf-legend__source">{comment}</div>}
    </div>
  );
};

Legend.propTypes = {
  title: PropTypes.string.isRequired,
  shape: PropTypes.oneOf(['circle', 'line', 'square', 'stackedCircle']),
  comment: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      source: PropTypes.string,
      color: PropTypes.string,
      shape: PropTypes.string,
      size: PropTypes.number,
    }),
  ),
  position: PropTypes.string,
  translate: PropTypes.func,
};
Legend.defaultProps = {
  position: 'left',
  comment: '',
  items: [],
  shape: 'square',
  translate: translateMock({
    'terralego.legend.nolabel': 'No label',
    'terralego.legend.labelNoValue': 'Value not available',
    'terralego.legend.label': 'From {{lower}} to {{upper}}',
    'terralego.legend.labelFirst': 'More than {{lower}}',
    'terralego.legend.labelLast': 'Less than {{upper}}',
  }),
};


/** translate old legend config to new standard. To be removed when
 * all legends are migrated
 */
const LegendCompat = ({ stackedCircles, content, source, items = [], ...props }) => {
  const compatible = { ...props };

  compatible.shape = props.shape;

  if (!props.shape) {
    if (items.length) {
      compatible.shape = items[0].shape || 'square';
    }
  }

  if (stackedCircles) {
    compatible.shape = 'stackedCircle';
  }

  if (source && !compatible.comment) {
    compatible.comment = source;
  }

  compatible.items = items.filter(({ items: subItems }) => !subItems)
    .map(({ radius, diameter, size, shape, ...itemRest }) => {
      let newSize;
      if (radius) {
        newSize = radius; // I know, should be *2 but missused...
      }
      if (diameter) {
        newSize = diameter;
      }
      if (size) {
        newSize = size;
      }
      if (newSize) {
        return { size: newSize, ...itemRest };
      }
      return itemRest;
    });

  return Legend({ ...compatible });
};


LegendCompat.defaultProps = {
  position: 'left',
  items: [],
  translate: translateMock({
    'terralego.legend.nolabel': 'No label',
    'terralego.legend.labelNoValue': 'Value not available',
    'terralego.legend.label': 'From {{lower}} to {{upper}}',
    'terralego.legend.labelFirst': 'More than {{lower}}',
    'terralego.legend.labelLast': 'Less than {{upper}}',
  }),
};

export default LegendCompat;
