import React from 'react';
import classnames from 'classnames';
import { Button } from '@blueprintjs/core';

import translateMock from '../../../../../utils/translate';

import LayerFetchValues from '../LayerFetchValues';
import FiltersPanel from '../FiltersPanel';
import Tooltip from '../../../../../components/Tooltip';

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
    'terralego.visualizer.layerstree.itemOptions.widget.title': 'widget',
    'terralego.visualizer.layerstree.itemOptions.widget.action-open': 'open widget',
    'terralego.visualizer.layerstree.itemOptions.widget.action-close': 'close widget',
    'terralego.visualizer.layerstree.itemOptions.widget.title_synthesis': 'widget synthesis',
    'terralego.visualizer.layerstree.itemOptions.widget.action-open_synthesis': 'open synthesis',
    'terralego.visualizer.layerstree.itemOptions.widget.action-close_synthesis': 'close synthesis',
    'terralego.visualizer.layerstree.itemOptions.table.label': 'table',
    'terralego.visualizer.layerstree.itemOptions.table.alt': 'open table',
    'terralego.visualizer.layerstree.itemOptions.table.alt_close': 'close table',
    'terralego.visualizer.layerstree.itemOptions.table.tooltip': 'open table',
    'terralego.visualizer.layerstree.itemOptions.table.tooltip_close': 'close table',
    'terralego.visualizer.layerstree.itemOptions.filter.label': 'filters',
    'terralego.visualizer.layerstree.itemOptions.filter.alt': 'open filters',
    'terralego.visualizer.layerstree.itemOptions.filter.alt_close': 'close filters',
    'terralego.visualizer.layerstree.itemOptions.filter.tooltip': 'open filters',
    'terralego.visualizer.layerstree.itemOptions.filter.tooltip_close': 'close filters',
    'terralego.visualizer.layerstree.itemOptions.options.label': 'options',
    'terralego.visualizer.layerstree.itemOptions.options.alt': 'open options',
    'terralego.visualizer.layerstree.itemOptions.options.alt_close': 'close options',
    'terralego.visualizer.layerstree.itemOptions.options.tooltip': 'open options',
    'terralego.visualizer.layerstree.itemOptions.options.tooltip_close': 'close options',
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
      // i18next-extract-mark-context-start ["", "synthesis"]
      widgets.map(widget => {
        const { component: context } = widget;
        const isActive = isWidgetActive(widget);

        const actionText = isActive
          ? translate('terralego.visualizer.layerstree.itemOptions.widget.action-close', { context })
          : translate('terralego.visualizer.layerstree.itemOptions.widget.action-open', { context });

        return (
          <Tooltip
            key={context}
            className="layerstree-node-content__options__tooltip widgets"
            content={actionText}
          >
            <Button
              className={classnames({
                'layerstree-node-content__options__button': true,
                'layerstree-node-content__options__button--active': isActive,
              })}
              onClick={toggleWidgets(widget)}
              minimal
              icon="selection"
              title={translate('terralego.visualizer.layerstree.itemOptions.widget.title', {
                context,
              })}
              alt={actionText}
            />
          </Tooltip>
        );
      })
      // i18next-extract-mark-context-stop
    )}
    {displayTableButton && (
      <Tooltip
        className="layerstree-node-content__options__tooltip table"
        content={translate('terralego.visualizer.layerstree.itemOptions.table.tooltip', {
          context: isTableActive ? 'close' : 'open',
        })}
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
          alt={translate('terralego.visualizer.layerstree.itemOptions.table.alt', {
            context: isTableActive ? 'close' : 'open',
          })}
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
        content={translate('terralego.visualizer.layerstree.itemOptions.filter.tooltip', {
          context: isFilterVisible ? 'close' : 'open',
        })}
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
          alt={translate('terralego.visualizer.layerstree.itemOptions.filter.alt', {
            context: isFilterVisible ? 'close' : 'open',
          })}
        />
      </Tooltip>
    </FiltersPanel>
    )}
    <Tooltip
      content={translate('terralego.visualizer.layerstree.itemOptions.options.tooltip', {
        context: isOptionsOpen ? 'close' : 'open',
      })}

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
        alt={translate('terralego.visualizer.layerstree.itemOptions.options.alt', {
          context: isOptionsOpen ? 'close' : 'open',
        })}
      />
    </Tooltip>
  </div>
);

export default LayersTreeItemOptionsDesktop;
