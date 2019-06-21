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
      'layerNode-options',
      'layerNode-options--desktop',
      { 'layerNode-options--active': hasSomeOptionActive },
    )}
  >
    {displayTableButton && (
    <Tooltip
      content={isTableActive ? 'Fermer le tableau' : 'Ouvrir le tableau'}
      className="layerNode__tooltip"
    >
      <Button
        className={
        classnames(
          'layerNode-options__button',
          { 'layerNode-options__button--active': isTableActive },
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
        className="layerNode__tooltip"
      >
        <Button
          className={
        classnames(
          'layerNode-options__button',
          { 'layerNode-options__button--active': isFilterVisible },
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
      className="layerNode__tooltip"
    >
      <Button
        className={
        classnames(
          'layerNode-options__button',
          'layerNode-options__button--more',
          { 'layerNode-options__button--active': isOptionsOpen },
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


// {(widgets && !!widgets.length) && (
//   widgets.map(widget => (
//     <Tooltip
//       content={isWidgetActive ? `Fermer le widget ${widget.component}` : `Ouvrir le widget ${widget.component}`}
//       className="layerNode__tooltip"
//     >
//       <Button
//         key={widget.component}
//         className={classnames({
//           'layerNode-options__button': true,
//           'layerNode-options__button--active': isWidgetActive(widget),
//         })}
//         onClick={toggleWidgets(widget)}
//         minimal
//         icon="selection"
//         title={`widget ${widget.component}`}
//       />
//     </Tooltip>
//   ))
// )
// }
