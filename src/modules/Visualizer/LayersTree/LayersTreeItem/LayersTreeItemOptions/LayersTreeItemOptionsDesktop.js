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
    'terralego.visualizer.layerstree.itemOptions.widget.open': 'open {{widget}}',
    'terralego.visualizer.layerstree.itemOptions.widget.close': 'close {{widget}}',
    'terralego.visualizer.layerstree.itemOptions.table.label': 'table',
    'terralego.visualizer.layerstree.itemOptions.table.open': 'open table',
    'terralego.visualizer.layerstree.itemOptions.table.close': 'close table',
    'terralego.visualizer.layerstree.itemOptions.filter.label': 'filters',
    'terralego.visualizer.layerstree.itemOptions.filter.open': 'open filters',
    'terralego.visualizer.layerstree.itemOptions.filter.close': 'close filters',
    'terralego.visualizer.layerstree.itemOptions.options.label': 'options',
    'terralego.visualizer.layerstree.itemOptions.options.open': 'open options',
    'terralego.visualizer.layerstree.itemOptions.options.close': 'close options',
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
          content={translate(`terralego.visualizer.layerstree.itemOptions.widget.${isWidgetActive(widget) ? 'close' : 'open'}`, { widget: widget.component })}
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
            alt={translate(`terralego.layerstree.itemOptions.widget.${isWidgetActive(widget) ? 'close' : 'open'}`, { widget: widget.component })}
          />
        </Tooltip>
      ))
    )}
    {displayTableButton && (
      <Tooltip
        className="layerstree-node-content__options__tooltip table"
        content={translate(`terralego.visualizer.layerstree.itemOptions.table.${isTableActive ? 'close' : 'open'}`)}
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
          title={translate('terralego.visualizer.layerstree.itemOptions.table.title')}
          alt={translate(`terralego.visualizer.layerstree.itemOptions.table.${isTableActive ? 'close' : 'open'}`)}
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
        content={translate(`terralego.visualizer.layerstree.itemOptions.filter.${isFilterVisible ? 'close' : 'open'}`)}
        className="visualizer.layerstree-node-content__options__tooltip filters"
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
          title={translate('terralego.visualizer.layerstree.itemOptions.filter.label')}
          alt={translate(`terralego.visualizer.layerstree.itemOptions.filter.${isFilterVisible ? 'close' : 'open'}`)}
        />
      </Tooltip>
    </FiltersPanel>
    )}
    <Tooltip
      content={translate(`terralego.visualizer.layerstree.itemOptions.options.${isOptionsOpen ? 'close' : 'open'}`)}
      className="layerNode__tooltip options"
    >
      <Button
        className={
          classnames(
            'layerstree-node-content__options__button',
            'layerstree-node-content__options__button--more',
            { 'layerstree-node-content__options__button--active': isOptionsOpen },
          )}
        icon="more"
        minimal
        onClick={handleOptionPanel}
        title={translate('terralego.visualizer.layerstree.itemOptions.options.label')}
        alt={translate(`terralego.visualizer.layerstree.itemOptions.options.${isOptionsOpen ? 'close' : 'open'}`)}
      />
    </Tooltip>
  </div>
);

export default LayersTreeItemOptionsDesktop;
