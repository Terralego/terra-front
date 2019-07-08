import React from 'react';
import classnames from 'classnames';
import { Button } from '@blueprintjs/core';

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
        >
          {widget.component}
        </Button>
      ))
    )}
    {displayTableButton && (
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
        alt={isTableActive ? 'Fermer le tableau' : 'Ouvrir le tableau'}
        title="table"
      >
        table
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
      title="options d'affichage"
    >
      options
    </Button>
  </div>
);

export default LayersTreeItemOptionsTablet;
