import React from 'react';
import classnames from 'classnames';
import { Button, Classes, Intent, Overlay } from '@blueprintjs/core';
import LocateButton from '../LocateButton';

import translateMock from '../../../../../utils/translate';

import LayerFetchValues from '../LayerFetchValues';
import FiltersPanel from '../FiltersPanel';
import Tooltip from '../../../../../components/Tooltip';
import LayersTreeItemOptionOverflow from './LayersTreeItemOptionOverflow';
import GenericPanel from '../GenericPanel';

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
    'terralego.visualizer.layerstree.itemOptions.opacity.label': 'Opacité',
    'terralego.visualizer.layerstree.itemOptions.opacity.tooltip': "Changer l'opacité de la couche",
  }),
}) => {
  const [isPanelOpen, setPanelOpen] = React.useState(false);
  const [isOverlayOpen, setOverlayOpen] = React.useState(false);
  const [activeEmbed, setActiveEmbed] = React.useState(null);

  const handleOverlayClose = React.useCallback(() => {
    setOverlayOpen(false);
    setActiveEmbed(null);
  }, []);

  return (
    <>
      {layer?.embed?.length && (
        <Overlay
          lazy
          isOpen={isOverlayOpen}
          onClose={handleOverlayClose}
        >
          <div
            className={classnames(
              Classes.CARD,
              Classes.ELEVATION_4,
            )}
            style={{ inset: 20 }}
          >
            {activeEmbed && (
              <iframe
                title={activeEmbed.title}
                src={activeEmbed.url}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            )}
            <Button
              intent={Intent.DANGER}
              onClick={handleOverlayClose}
              style={{
                margin: '',
                position: 'absolute',
                bottom: 25,
                right: 25,
              }}
            >
              Close
            </Button>
          </div>
        </Overlay>
      )}

      <LayersTreeItemOptionOverflow translate={translate} hasSomeOptionActive={hasSomeOptionActive}>
        <LocateButton
          map={map}
          layer={layer}
          translate={translate}
          extent={extent}
          isTableActive={isTableActive}
          isDetailsVisible={isDetailsVisible}
          hasActiveWidget={widgets && !!widgets.length && widgets.find(w => isWidgetActive(w))}
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
                    text={translate('terralego.visualizer.layerstree.itemOptions.widget.title', {
                      context,
                    })}
                    alt={actionText}
                  />
                </Tooltip>
              );
            })
          // i18next-extract-mark-context-stop
        }
        {displayTableButton && (
          <Tooltip
            className="layerstree-node-content__options__tooltip table"
            content={translate('terralego.visualizer.layerstree.itemOptions.table.tooltip', {
              context: isTableActive ? 'close' : 'open',
            })}
          >
            <Button
              className={classnames('layerstree-node-content__options__button', {
                'layerstree-node-content__options__button--active': isTableActive,
              })}
              onClick={toggleTable}
              minimal
              icon="th"
              title={translate('terralego.visualizer.layerstree.itemOptions.table.title')}
              text={translate('terralego.visualizer.layerstree.itemOptions.table.title')}
              alt={translate('terralego.visualizer.layerstree.itemOptions.table.alt', {
                context: isTableActive ? 'close' : 'open',
              })}
            />
          </Tooltip>
        )}
        {form && (
          <Tooltip
            content={translate('terralego.visualizer.layerstree.itemOptions.filter.tooltip', {
              context: isFilterVisible ? 'close' : 'open',
            })}
            className="visualizer.layerstree-node-content__options__tooltip filters"
          >
            <Button
              className={classnames('layerstree-node-content__options__button', {
                'layerstree-node-content__options__button--active': isFilterVisible,
              })}
              onClick={toggleFilters}
              minimal
              icon="filter"
              text={translate('terralego.visualizer.layerstree.itemOptions.filter.label')}
              title={translate('terralego.visualizer.layerstree.itemOptions.filter.label')}
              alt={translate('terralego.visualizer.layerstree.itemOptions.filter.alt', {
                context: isFilterVisible ? 'close' : 'open',
              })}
            />
          </Tooltip>
        )}
        <Tooltip
          content={translate('terralego.visualizer.layerstree.itemOptions.opacity.tooltip')}
          className="layerNode__tooltip options"
        >
          <Button
            className={classnames('layerstree-node-content__options__button', {
              'layerstree-node-content__options__button--active': isOptionsOpen,
            })}
            icon="eye-open"
            minimal
            onClick={handleOptionPanel}
            title={translate('terralego.visualizer.layerstree.itemOptions.opacity.label')}
            text={translate('terralego.visualizer.layerstree.itemOptions.opacity.label')}
            alt={translate('terralego.visualizer.layerstree.itemOptions.opacity.label', {
              context: isOptionsOpen ? 'close' : 'open',
            })}
          />
        </Tooltip>
        {layer?.content && (
          <Tooltip
            position="bottom"
            content="Ouvrir les informations de la couche"
            className="layerNode__tooltip options"
          >
            <Button
              className={classnames('layerstree-node-content__options__button', {
                'layerstree-node-content__options__button--active': isPanelOpen,
              })}
              icon="info-sign"
              minimal
              title="Informations"
              text="Informations"
              onClick={() => setPanelOpen(!isPanelOpen)}
            />
          </Tooltip>
        )}
        {layer?.embed?.map(item => (
          <Tooltip
            key={JSON.stringify(item)}
            content={item.title}
            className="layerNode__tooltip options"
          >
            <Button
              className={classnames('layerstree-node-content__options__button')}
              icon="grouped-bar-chart"
              minimal
              onClick={() => {
                setActiveEmbed(item);
                setOverlayOpen(true);
              }}
              text={item.title}
              alt={item.title}
            />
          </Tooltip>
        ))}
      </LayersTreeItemOptionOverflow>
      {form && (
        <FiltersPanel visible={isFilterVisible} onMount={getFilterPanelRef} layer={layer}>
          {isFilterVisible && <LayerFetchValues layer={layer} isFilterVisible={isFilterVisible} />}
        </FiltersPanel>
      )}
      {layer?.content && (
        <GenericPanel
          isOpen={isPanelOpen}
          handleClose={() => setPanelOpen(false)}
          left={0}
          top={300}
          width={300}
          visible
          title="Informations"
        >
          <p>{layer.content}</p>
        </GenericPanel>
      )}
    </>
  );
};

export default LayersTreeItemOptionsDesktop;
