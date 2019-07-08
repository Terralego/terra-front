import React from 'react';
import classnames from 'classnames';
import { Button, Tooltip } from '@blueprintjs/core';

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
          content={isWidgetActive(widget) ? `Fermer le widget ${widget.component}` : `Ouvrir le widget ${widget.component}`}
          className="layerstree-node-content__options__tooltip widgets"
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
          />
        </Tooltip>
      ))
    )
}
    {displayTableButton && (
      <Tooltip
        content={isTableActive ? 'Fermer le tableau' : 'Ouvrir le tableau'}
        className="layerstree-node-content__options__tooltip table"
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
          alt={isTableActive ? 'Fermer le tableau' : 'Ouvrir le tableau'}
          title="table"
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
        content={isFilterVisible ? 'Fermer les filtres' : 'Ouvrir les filtres'}
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
          title="filter"
        />
      </Tooltip>
    </FiltersPanel>
    )}
    <Tooltip
      content={isOptionsOpen ? 'Fermer les options' : 'Ouvrir les options'}
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
        title="options d'affichage"
      />
    </Tooltip>
  </div>
);

export default LayersTreeItemOptionsDesktop;
