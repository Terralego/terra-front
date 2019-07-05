import React from 'react';
import classnames from 'classnames';
import { Button, Tooltip } from '@blueprintjs/core';

import translateMock from '../../../../../utils/translate';

import LayerFetchValues from '../LayerFetchValues';
import FiltersPanel from '../FiltersPanel';

const LayersTreeItemOptionsDesktop = ({
  hasSomeOptionActive,
  isOptionsOpen,
  handleOptionPanel,
  layer,
  toggleFilters,
  isFilterVisible,
  getFilterPanelRef,
  form,
  toggleTable,
  isTableActive,
  displayTableButton,
  toggleWidgets,
  widgets,
  isWidgetActive,
  translate = translateMock({
    'layerstree.itemOptions.open': 'open',
    'layerstree.itemOptions.close': 'close',
    'layerstree.itemOptions.widget.label': 'widget',
    'layerstree.itemOptions.table.label': 'table',
    'layerstree.itemOptions.table.open': 'open table',
    'layerstree.itemOptions.table.close': 'close table',
    'layerstree.itemOptions.filter.label': 'filters',
    'layerstree.itemOptions.filter.open': 'open filters',
    'layerstree.itemOptions.filter.close': 'close filters',
    'layerstree.itemOptions.options.label': 'options',
    'layerstree.itemOptions.options.open': 'open options',
    'layerstree.itemOptions.options.close': 'close options',
  }),
}) => (
  <div
    className={classnames(
      'layerstree-node-content__options',
      'layerstree-node-content__options--desktop',
      { 'layerstree-node-content__options--active': hasSomeOptionActive },
    )}
  >
    {(widgets && !!widgets.length) && (
      widgets.map(widget => (
        <Tooltip
          key={widget.component}
          className="layerstree-node-content__options__tooltip widgets"
          content={isWidgetActive(widget)
            ? `${translate('layerstree.itemOptions.close')} ${widget.component}`
            : `${translate('layerstree.itemOptions.open')} ${widget.component}`
          }
        >
          <Button
            className={classnames({
              'layerstree-node-content__options__button': true,
              'layerstree-node-content__options__button--active': isWidgetActive(widget),
            })}
            onClick={toggleWidgets(widget)}
            minimal
            icon="selection"
            title={`widget ${widget.component}`}
            alt={isWidgetActive(widget)
              ? `${translate('layerstree.itemOptions.close')} ${widget.component}`
              : `${translate('layerstree.itemOptions.open')} ${widget.component}`
            }
          />
        </Tooltip>
      ))
    )
}
    {displayTableButton && (
      <Tooltip
        className="layerstree-node-content__options__tooltip table"
        content={isTableActive
          ? translate('layerstree.itemOptions.table.close')
          : translate('layerstree.itemOptions.table.open')
        }
      >
        <Button
          className={
        classnames(
          'layerstree-node-content__options__button',
          { 'layerstree-node-content__options__button--active': isTableActive },
        )
      }
          onClick={toggleTable}
          minimal
          icon="th"
          title={translate('layerstree.itemOptions.table.title')}
          alt={isTableActive
            ? translate('layerstree.itemOptions.table.close')
            : translate('layerstree.itemOptions.table.open')
          }
        />
      </Tooltip>
    )}
    {form && (
    <FiltersPanel
      visible={isFilterVisible}
      onMount={getFilterPanelRef}
      layer={layer}
    >
      {isFilterVisible && (
      <LayerFetchValues layer={layer} isFilterVisible={isFilterVisible} />
      )}
      <Tooltip
        content={isFilterVisible
          ? translate('layerstree.itemOptions.filter.close')
          : translate('layerstree.itemOptions.filter.open')
        }
        className="layerstree-node-content__options__tooltip filters"
      >
        <Button
          className={
        classnames(
          'layerstree-node-content__options__button',
          { 'layerstree-node-content__options__button--active': isFilterVisible },
        )}
          onClick={toggleFilters}
          minimal
          icon="filter"
          title={translate('layerstree.itemOptions.filter.label')}
          alt={isFilterVisible
            ? translate('layerstree.itemOptions.filter.close')
            : translate('layerstree.itemOptions.filter.open')
          }
        />
      </Tooltip>
    </FiltersPanel>
    )}
    <Tooltip
      content={isOptionsOpen
        ? translate('layerstree.itemOptions.options.close')
        : translate('layerstree.itemOptions.options.open')
      }
      className="layerstree-node-content__options__tooltip options"
    >
      <Button
        className={
        classnames(
          'layerstree-node-content__options__button',
          'layerstree-node-content__options__button--more',
          { 'layerstree-node-content__options__button--active': isOptionsOpen },
        )
      }
        icon="more"
        minimal
        onClick={handleOptionPanel}
        title={translate('layerstree.itemOptions.options.label')}
        alt={isOptionsOpen
          ? translate('layerstree.itemOptions.options.close')
          : translate('layerstree.itemOptions.options.open')
        }
      />
    </Tooltip>
  </div>
);

export default LayersTreeItemOptionsDesktop;
