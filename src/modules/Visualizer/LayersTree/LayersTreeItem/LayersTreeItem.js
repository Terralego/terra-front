import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Card,
  Switch,
  Elevation,
  Tag,
} from '@blueprintjs/core';
import uuid from 'uuid/v4';

import OptionsLayer from './OptionsLayer';
import LayersTreeItemFilters from './LayersTreeItemFilters';
import LayerProps from '../../types/Layer';
import LayersTreeItemOptions from './LayersTreeItemOptions';
import withDeviceSize from '../../../../hoc/withDeviceSize';
import WarningZoom from './WarningZoom';
import LayersTreeExclusiveItemsList from './LayersTreeExclusiveItemsList';
import Tooltip from '../../../../components/Tooltip';

export class LayersTreeItem extends React.Component {
  static propTypes = {
    layer: LayerProps.isRequired,
    isActive: PropTypes.bool,
    opacity: PropTypes.number,
    isTableActive: PropTypes.bool,
    total: PropTypes.number,
    setLayerState: PropTypes.func,
    isMobileSized: PropTypes.bool,
    isPhoneSized: PropTypes.bool,
  };

  static defaultProps = {
    isActive: false,
    opacity: 1,
    isTableActive: false,
    total: null,
    setLayerState () {},
    isMobileSized: false,
    isPhoneSized: false,
  }

  state = {
    isOptionsOpen: false,
    isFilterVisible: false,
    hasWidgetActive: false,
  }

  uuid = `toggle-${uuid()}`;

  componentWillUnmount () {
    this.resetFilterPanelListener();
  }

  onActiveChange = ({ target: { checked: active } }) => {
    const { layer, setLayerState } = this.props;
    setLayerState({ layer, state: { active, table: false } });
  }

  onOpacityChange = opacity => {
    const { activeLayer: layer, setLayerState } = this.props;
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
    const { activeLayer: layer, isTableActive, setLayerState } = this.props;
    setLayerState({ layer, state: { table: !isTableActive } });
  };

  toggleWidgets = widget => () => {
    const { activeLayer: layer, widgets: prevWidgets = [], setLayerState } = this.props;
    const contains = this.isWidgetActive(widget);
    const { hasWidgetActive } = this.state;
    const widgets = [
      ...(contains
        ? prevWidgets.filter(w => w !== widget)
        : [...prevWidgets, widget]),
    ];

    this.setState({ hasWidgetActive: !hasWidgetActive });

    setLayerState({ layer, state: { widgets } });
  }

  isWidgetActive = widget => {
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
        group,
        label = group,
        exclusive,
        filters: {
          form: layerForm, fields: layerFields,
        } = {},
      },
      activeLayer,
      activeLayer: {
        filters: { form = layerForm, fields = layerFields } = {},
        widgets = layer.widgets,
      } = {},
      isActive,
      opacity,
      isTableActive,
      total,
      hidden,
      isMobileSized,
      isPhoneSized,
      map,
    } = this.props;

    if (hidden) return null;

    const {
      isOptionsOpen, isFilterVisible, hasWidgetActive,
    } = this.state;
    const {
      onActiveChange,
      onOpacityChange,
      toggleFilters,
      toggleTable,
      getFilterPanelRef,
      toggleWidgets,
      handleOptionPanel,
      isWidgetActive,
    } = this;

    const totalResult = typeof (total) === 'number';
    const hasSomeOptionActive =
    isTableActive || isFilterVisible || isOptionsOpen || hasWidgetActive;

    const displayTableButton = fields && !!fields.length;

    return (
      <Card
        className={classnames('layerstree-node', { 'options-hidden': isActive })}
        elevation={Elevation.ZERO}
        style={{ opacity: isActive ? 1 : 0.7 }}
      >
        <div className={
          classnames(
            { 'layerstree-node-content': !isMobileSized },
            { 'layerstree-node-content--desktop--active': !isMobileSized && hasSomeOptionActive },
            { 'layerstree-node-content--mobile': isMobileSized },
          )
        }
        >
          <div className={
            classnames(
              { 'layerstree-node-content__item': !isMobileSized },
              { 'layerstree-node-content__item--mobile': isMobileSized },
            )
          }
          >
            <div className={
            classnames(
              { 'layerstree-node-content__item-label': !isMobileSized },
              { 'layerstree-node-content__item-label--mobile': isMobileSized },
            )
          }
            >
              <WarningZoom
                isActive={isActive}
                map={map}
                layer={layer}
              >
                <Switch
                  checked={!!isActive}
                  onChange={onActiveChange}
                  id={this.uuid}
                />
              </WarningZoom>
              <Tooltip
                content={label}
                hoverOpenDelay={2000}
                className="layerstree-node-content__item-label__tooltip"
              >
                <label className="layerstree-node-content__item-label__label" htmlFor={this.uuid}>{label}</label>
              </Tooltip>
              <div className="layerstree-node-content__item-label__total">
                {isActive && totalResult && (
                <Tag
                  intent="primary"
                  round
                >
                  {total}
                </Tag>
                )}
              </div>
            </div>
            {isMobileSized && isActive && exclusive && (
              <LayersTreeExclusiveItemsList
                layer={layer}
              />
            )}
          </div>
          {isActive && !isPhoneSized && (
          <LayersTreeItemOptions
            hasSomeOptionActive={hasSomeOptionActive}
            isOptionsOpen={isOptionsOpen}
            handleOptionPanel={handleOptionPanel}
            layer={activeLayer}
            toggleFilters={toggleFilters}
            isFilterVisible={isFilterVisible}
            getFilterPanelRef={getFilterPanelRef}
            form={form}
            toggleTable={toggleTable}
            isTableActive={isTableActive}
            displayTableButton={displayTableButton}
            toggleWidgets={toggleWidgets}
            widgets={widgets}
            isWidgetActive={isWidgetActive}
            map={map}
          />
          )}
        </div>
        {isOptionsOpen && isActive && (
          <OptionsLayer
            onOpacityChange={onOpacityChange}
            opacity={opacity}
          />
        )}
        <LayersTreeItemFilters layer={activeLayer} />
        {!isMobileSized && isActive && exclusive && (
          <LayersTreeExclusiveItemsList
            layer={layer}
          />
        )}
      </Card>
    );
  }
}

export default withDeviceSize()(LayersTreeItem);
