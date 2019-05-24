import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Card, Switch, Elevation, Tag } from '@blueprintjs/core';

import LayerFetchValues from './LayerFetchValues';
import LayersTreeSubItemsList from './LayersTreeSubItemsList';
import OptionsLayer from './OptionsLayer';
import FiltersPanel from './FiltersPanel';
import filterIcon from './assets/filter.svg';
import tableIcon from './assets/table.svg';
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
    const widgets = [
      ...(contains
        ? prevWidgets.filter(w => w !== widget)
        : [...prevWidgets, widget]),
    ];

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
      isOptionsOpen, isFilterVisible,
    } = this.state;
    const {
      onActiveChange, onOpacityChange, toggleFilters, toggleTable, getFilterPanelRef, toggleWidgets,
    } = this;

    const totalResult = typeof (total) === 'number';

    return (
      <Card
        className={classnames('layerNode-container', { 'options-hidden': isActive })}
        elevation={Elevation.ZERO}
        style={{ opacity: isActive ? 1 : 0.7 }}
      >
        <div className="layerNode-label-container">
          <Switch
            checked={!!isActive}
            label={label}
            onChange={onActiveChange}
          />
          <div className="layerNode-options">
            {isActive && totalResult && (
            <Tag
              intent="primary"
              round
            >
                {total}
            </Tag>
            )}
            {(isActive && widgets && !!widgets.length) && (
              widgets.map(widget => (
                <Button
                  key={widget.component}
                  className={classnames({
                    'layerNode-widgets__buttons': true,
                    'layerNode-widgets__buttons--active': this.isWidgetActive(widget),
                  })}
                  onClick={toggleWidgets(widget)}
                  minimal
                  icon="selection"
                />
              ))
            )}
            {isActive && filters
              && (
              <Button
                className={classnames('layerNode-options__buttons', { 'layerNode-options__buttons--active': isTableActive })}
                onClick={toggleTable}
                minimal
              >
                <img className="icon" src={tableIcon} alt={isTableActive ? 'Fermer le tableau' : 'Ouvrir le tableau'} title="table" />
              </Button>
              )
            }
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
                  className={classnames('layerNode-options__buttons', { 'layerNode-options__buttons--active': isFilterVisible })}
                  onClick={toggleFilters}
                  minimal
                >
                  <img className="icon" src={filterIcon} alt={isFilterVisible ? 'Fermer le panneau des filtres' : 'Ouvrir le panneau des filtres'} title="filter" />
                </Button>
              </FiltersPanel>
            )}
            {isActive && (
              <Button
                className="layerNode-options__buttons"
                id="button-more-vertical"
                icon="more"
                minimal
                onClick={this.handleOptionPanel}
              />
            )}
          </div>
        </div>
        {isActive && sublayers && (
          <LayersTreeSubItemsList
            layer={layer}
            sublayers={sublayers}
          />
        )}
        {isOptionsOpen && isActive && (
          <OptionsLayer
            onOpacityChange={onOpacityChange}
            opacity={opacity}
          />
        )}
        <LayersTreeItemFilters layer={layer} />
      </Card>
    );
  }
}

export default LayersTreeItem;
