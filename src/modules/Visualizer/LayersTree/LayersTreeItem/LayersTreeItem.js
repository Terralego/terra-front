import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Card, Switch, Elevation, Tag, Tooltip } from '@blueprintjs/core';

import LayerFetchValues from './LayerFetchValues';
import LayersTreeSubItemsList from './LayersTreeSubItemsList';
import OptionsLayer from './OptionsLayer';
import FiltersPanel from './FiltersPanel';
import LayersTreeItemFilters from './LayersTreeItemFilters';
import LayerProps from '../../types/Layer';

export class LayersTreeItem extends React.Component {
  static propTypes = {
    layer: LayerProps.isRequired,
    isActive: PropTypes.bool,
    opacity: PropTypes.number,
    isTableActive: PropTypes.bool,
    total: PropTypes.number,

    setLayerState: PropTypes.func,
  };

  static defaultProps = {
    isActive: false,
    opacity: 1,
    isTableActive: false,
    total: null,
    setLayerState () {},
  }

  state = {
    isOptionsOpen: false,
    isFilterVisible: false,
    isWidgetActive: false,
  }

  componentWillUnmount () {
    this.resetFilterPanelListener();
  }

  onActiveChange = ({ target: { checked: active } }) => {
    const { layer, setLayerState } = this.props;
    setLayerState({ layer, state: { active, table: false } });
  }

  onOpacityChange = opacity => {
    const { layer, setLayerState } = this.props;
    setLayerState({ layer, state: { opacity } });
  }

  getFilterPanelRef = refs => {
    this.resetFilterPanelListener();
    document.body.addEventListener('mousedown', this.clickListener = ({ target }) => {
      if (refs.reduce((contains, el) => contains || el.contains(target), false)) {
        return;
      }
      this.setState({ isFilterVisible: false });
    });
  }

  handleOptionPanel = () => {
    const { isOptionsOpen } = this.state;
    this.setState({ isOptionsOpen: !isOptionsOpen });
  }

  toggleFilters = () => this.setState(({ isFilterVisible }) =>
    ({ isFilterVisible: !isFilterVisible }));

  toggleTable = () => {
    const { layer, isTableActive, setLayerState } = this.props;
    setLayerState({ layer, state: { table: !isTableActive } });
  };

  toggleWidgets = widget => () => {
    const { layer, widgets: prevWidgets = [], setLayerState } = this.props;
    const contains = this.isWidgetActive(widget);
    const { isWidgetActive } = this.state;
    const widgets = [
      ...(contains
        ? prevWidgets.filter(w => w !== widget)
        : [...prevWidgets, widget]),
    ];
    this.setState({ isWidgetActive: !isWidgetActive });
    setLayerState({ layer, state: { widgets } });
  }

  isWidgetActive (widget) {
    const { widgets = [] } = this.props;
    return widgets.includes(widget);
  }

  resetFilterPanelListener () {
    if (this.clickListener) {
      document.body.removeEventListener('mousedown', this.clickListener);
    }
  }

  render () {
    const {
      layer,
      layer: {
        label,
        sublayers,
        filters,
        filters: { form } = {},
        widgets = [],
      },
      isActive,
      opacity,
      isTableActive,
      total,
      hidden,
    } = this.props;

    if (hidden) return null;

    const {
      isOptionsOpen, isFilterVisible, isWidgetActive,
    } = this.state;
    const {
      onActiveChange, onOpacityChange, toggleFilters, toggleTable, getFilterPanelRef, toggleWidgets,
    } = this;

    const totalResult = typeof (total) === 'number';
    const hasSomeOptionActive = isTableActive || isFilterVisible || isOptionsOpen || isWidgetActive;

    const htmlID = btoa(JSON.stringify(layer).replace(/\W/g, ''));

    return (
      <Card
        className={classnames('layerNode-container', { 'options-hidden': isActive })}
        elevation={Elevation.ZERO}
        style={{ opacity: isActive ? 1 : 0.7 }}
      >
        <Tooltip
          content={label}
          hoverOpenDelay={2000}
          className="layerNode__tooltip"
        >
          <div className="layerNode__content">
            <Switch
              checked={!!isActive}
              onChange={onActiveChange}
              id={`toggle-${htmlID}`}
            />
            <label className="layerNode__label" htmlFor={`toggle-${htmlID}`}>{label}</label>
            <div className="layerNode-total">
              {isActive && totalResult && (
                <Tag
                  intent="primary"
                  round
                >
                  {total}
                </Tag>
              )}
            </div>
            <div className={classnames('layerNode-options', { 'layerNode-options--active': hasSomeOptionActive })}>
              {(isActive && widgets && !!widgets.length) && (
                widgets.map(widget => (
                  <Button
                    key={widget.component}
                    className={classnames({
                      'layerNode-options__button': true,
                      'layerNode-options__button--active': this.isWidgetActive(widget),
                    })}
                    onClick={toggleWidgets(widget)}
                    minimal
                    icon="selection"
                    title="widget synthèse"
                  />
                ))
              )}
              {isActive && filters && (
                <Button
                  className={classnames('layerNode-options__button', { 'layerNode-options__button--active': isTableActive })}
                  onClick={toggleTable}
                  minimal
                  icon="th"
                  alt={isTableActive ? 'Fermer le tableau' : 'Ouvrir le tableau'}
                  title="table"
                />
              )}
              {isActive && form && (
                <FiltersPanel
                  visible={isFilterVisible}
                  onMount={getFilterPanelRef}
                  layer={layer}
                >
                  {isFilterVisible && (
                    <LayerFetchValues layer={layer} isFilterVisible={isFilterVisible} />
                  )}
                  <Button
                    className={classnames('layerNode-options__button', { 'layerNode-options__button--active': isFilterVisible })}
                    onClick={toggleFilters}
                    minimal
                    icon="filter"
                    alt={isFilterVisible ? 'Fermer le panneau des filtres' : 'Ouvrir le panneau des filtres'}
                    title="filter"
                  />
                </FiltersPanel>
              )}
              {isActive && (
                <Button
                  className={classnames('layerNode-options__button', 'layerNode-options__button--more', { 'layerNode-options__button--active': isOptionsOpen })}
                  icon="more"
                  minimal
                  onClick={this.handleOptionPanel}
                  title="options d'affichage"
                />
              )}
            </div>

          </div>
        </Tooltip>
        {isOptionsOpen && isActive && (
          <OptionsLayer
            onOpacityChange={onOpacityChange}
            opacity={opacity}
          />
        )}
        <>
          <LayersTreeItemFilters layer={layer} />
          {isActive && sublayers && (
            <LayersTreeSubItemsList
              layer={layer}
              sublayers={sublayers}
            />
          )}

        </>
      </Card>
    );
  }
}

export default LayersTreeItem;
