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
    'layerstree.itemOptions.widget.open': 'open {{widget}}',
    'layerstree.itemOptions.widget.close': 'close {{widget}}',
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
          alt={translate(`layerstree.itemOptions.widget.${isWidgetActive(widget) ? 'close' : 'open'}`, { widget: widget.component })}
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
      title={translate('layerstree.itemOptions.table.title')}
      alt={translate(`layerstree.itemOptions.table.${isTableActive ? 'close' : 'open'}`)}
    >
      {translate('layerstree.itemOptions.table.label')}
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
      title={translate('layerstree.itemOptions.options.label')}
      alt={translate(`layerstree.itemOptions.options.${isOptionsOpen ? 'close' : 'open'}`)}
    >
      {translate('layerstree.itemOptions.options.label')}
    </Button>
  </div>
);
export default LayersTreeItemOptionsTablet;
