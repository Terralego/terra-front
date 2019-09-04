import React from 'react';
import classnames from 'classnames';
import { Button } from '@blueprintjs/core';

import translateMock from '../../../../../utils/translate';

import LayerFetchValues from '../LayerFetchValues';
import FiltersPanel from '../FiltersPanel';

const LayersTreeItemOptionsTablet = ({
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
    'terralego.visualizer.layerstree.itemOptions.widget.alt': 'open {{widget}}',
    'terralego.visualizer.layerstree.itemOptions.widget.alt_close': 'close {{widget}}',
    'terralego.visualizer.layerstree.itemOptions.table.label': 'table',
    'terralego.visualizer.layerstree.itemOptions.table.alt': 'open table',
    'terralego.visualizer.layerstree.itemOptions.table.alt_close': 'close table',
    'terralego.visualizer.layerstree.itemOptions.filter.label': 'filters',
    'terralego.visualizer.layerstree.itemOptions.filter.alt': 'open filters',
    'terralego.visualizer.layerstree.itemOptions.filter.alt_close': 'close filters',
    'terralego.visualizer.layerstree.itemOptions.options.label': 'options',
    'terralego.visualizer.layerstree.itemOptions.options.alt': 'open options',
    'terralego.visualizer.layerstree.itemOptions.options.alt_close': 'close options',
  }),
}) => (
  <div
    className={classnames(
      'layerstree-node-content__options',
      'layerstree-node-content__options--mobile',
      { 'layerstree-node-content__options--active': hasSomeOptionActive },
    )}
  >
    {(widgets && !!widgets.length) && (
      widgets.map(widget => (
        <Button
          key={widget.component}
          className={classnames({
            'layerstree-node-content__options__button': true,
            'layerstree-node-content__options__button--active': isWidgetActive(widget),
          })}
          onClick={toggleWidgets(widget)}
          minimal
          icon="selection"
          title={`widget ${widget.component}`}
          alt={translate('terralego.visualizer.layerstree.itemOptions.widget.alt', {
            context: isWidgetActive(widget) ? 'close' : 'open',
            widget: widget.component,
          })}
        >
          {widget.component}
        </Button>
      ))
    )
}
    {displayTableButton && (
    <Button
      className={classnames(
        'layerstree-node-content__options__button',
        { 'layerstree-node-content__options__button--active': isTableActive },
      )}
      onClick={toggleTable}
      minimal
      icon="th"
      title={translate('terralego.visualizer.layerstree.itemOptions.table.title')}
      alt={translate('terralego.visualizer.layerstree.itemOptions.table.alt', {
        context: isTableActive ? 'close' : 'open',
      })}
    >
      {translate('terralego.visualizer.layerstree.itemOptions.table.label')}
    </Button>
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
        <Button
          className={
          classnames(
            'layerstree-node-content__options__button',
            { 'layerstree-node-content__options__button--active': isFilterVisible },
          )}
          onClick={toggleFilters}
          minimal
          icon="filter"
          title="filter"
        >
        filtres
        </Button>
      </FiltersPanel>
    )}
    <Button
      className={classnames(
        'layerstree-node-content__options__button',
        'layerstree-node-content__options__button--more',
        { 'layerstree-node-content__options__button--active': isOptionsOpen },
      )}
      icon="more"
      minimal
      onClick={handleOptionPanel}
      title={translate('terralego.visualizer.layerstree.itemOptions.options.label')}
      alt={translate('terralego.visualizer.layerstree.itemOptions.options.alt', {
        context: isOptionsOpen ? 'close' : 'open',
      })}
    >
      {translate('terralego.visualizer.layerstree.itemOptions.options.label')}
    </Button>
  </div>
);
export default LayersTreeItemOptionsTablet;
