import React from 'react';
import classnames from 'classnames';
import { Button } from '@blueprintjs/core';

import LayerFetchValues from '../LayerFetchValues';
import FiltersPanel from '../FiltersPanel';

const LayersTreeItemOptionsMobile = ({
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
      'layerNode-options--mobile',
      { 'layerNode-options--active': hasSomeOptionActive },
    )}
  >
    {displayTableButton && (
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
          'layerNode-options__button',
          { 'layerNode-options__button--active': isFilterVisible },
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
    >
    options
    </Button>
  </div>
);

export default LayersTreeItemOptionsMobile;


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
