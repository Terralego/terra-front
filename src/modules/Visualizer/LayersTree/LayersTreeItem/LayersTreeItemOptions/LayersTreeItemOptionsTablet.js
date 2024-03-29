import React from 'react';
import classnames from 'classnames';
import { Button } from '@blueprintjs/core';

import translateMock from '../../../../../utils/translate';

import LayerFetchValues from '../LayerFetchValues';
import FiltersPanel from '../FiltersPanel';
import LocateButton from '../LocateButton';
import GenericPanel from '../GenericPanel';

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
  map,
  extent,
  isDetailsVisible,
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
    'terralego.visualizer.layerstree.itemOptions.filter.label': 'filters',
    'terralego.visualizer.layerstree.itemOptions.filter.alt': 'open filters',
    'terralego.visualizer.layerstree.itemOptions.filter.alt_close': 'close filters',
    'terralego.visualizer.layerstree.itemOptions.options.label': 'options',
    'terralego.visualizer.layerstree.itemOptions.options.alt': 'open options',
    'terralego.visualizer.layerstree.itemOptions.options.alt_close': 'close options',
  }),
}) => {
  const [isPanelOpen, setPanelOpen] = React.useState(false);
  return (
    <div
      className={classnames(
        'layerstree-node-content__options',
        'layerstree-node-content__options--mobile',
        { 'layerstree-node-content__options--active': hasSomeOptionActive },
      )}
    >
      <LocateButton
        map={map}
        layer={layer}
        translate={translate}
        extent={extent}
        isTableActive={isTableActive}
        isDetailsVisible={isDetailsVisible}
        hasActiveWidget={widgets && !!widgets.length && widgets.find(w => isWidgetActive(w))}
        isTablet
      />
      {
        widgets &&
          !!widgets.length &&
          // i18next-extract-mark-context-start ["", "synthesis"]
          widgets.map(widget => {
            const { component: context } = widget;
            const isActive = isWidgetActive(widget);

            const actionText = isActive
              ? translate('terralego.visualizer.layerstree.itemOptions.widget.action-close', {
                context,
              })
              : translate('terralego.visualizer.layerstree.itemOptions.widget.action-open', {
                context,
              });
            return (
              <Button
                key={context}
                className={classnames({
                  'btn-widget': true,
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
              >
                {context}
              </Button>
            );
          })
        // i18next-extract-mark-context-stop
      }
      {displayTableButton && (
        <Button
          className={classnames('btn-table', 'layerstree-node-content__options__button', {
            'layerstree-node-content__options__button--active': isTableActive,
          })}
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
      {layer?.content && layer.description?.show_in_tree && (
        <Button
          className={classnames('layerstree-node-content__options__button', {
            'layerstree-node-content__options__button--active': isPanelOpen,
          })}
          icon="comment"
          minimal
          title="Informations"
          text="Informations"
          onClick={() => setPanelOpen(!isPanelOpen)}
        />
      )}
      {form && (
        <FiltersPanel visible={isFilterVisible} onMount={getFilterPanelRef} layer={layer}>
          {isFilterVisible && <LayerFetchValues layer={layer} isFilterVisible={isFilterVisible} />}
          <Button
            className={classnames('btn-form', 'layerstree-node-content__options__button', {
              'layerstree-node-content__options__button--active': isFilterVisible,
            })}
            onClick={toggleFilters}
            minimal
            icon="filter"
            title={translate('terralego.visualizer.layerstree.itemOptions.filter.label')}
          >
            {translate('terralego.visualizer.layerstree.itemOptions.filter.label')}
          </Button>
        </FiltersPanel>
      )}
      {layer?.content && layer.description?.show_in_tree && (
        <GenericPanel
          isOpen={isPanelOpen}
          handleClose={() => setPanelOpen(false)}
          left={-100}
          top={50}
          width={300}
          visible
          title="Informations"
        >
          <p>{layer.content}</p>
        </GenericPanel>
      )}
      <Button
        className={classnames('btn-option', 'layerstree-node-content__options__button', {
          'layerstree-node-content__options__button--active': isOptionsOpen,
        })}
        icon="eye-open"
        minimal
        onClick={handleOptionPanel}
        title={translate('terralego.visualizer.layerstree.itemOptions.opacity.label')}
        alt={translate('terralego.visualizer.layerstree.itemOptions.opacity.alt')}
      >
        {translate('terralego.visualizer.layerstree.itemOptions.opacity.label')}
      </Button>
    </div>
  );
};
export default LayersTreeItemOptionsTablet;
