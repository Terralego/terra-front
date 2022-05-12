import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Tab, Tabs } from '@blueprintjs/core';

import FeatureProperties from '../../Map/FeatureProperties';
import Template from '../../Template';
import ErrorBoundary from '../../../components/ErrorBoundary';
import './styles.scss';

class Details extends React.Component {
  state = {
    index: -1,
    hidden: true,
  };

  static getDerivedStateFromProps ({ feature, interaction }) {
    /**
     * Keep a copy of props to have a nice animation with previous content
     */
    if (feature) {
      return { feature, interaction };
    }
    return null;
  }

  componentDidMount () {
    const {
      feature: { properties: { _id } = {} } = {},
    } = this.props;
    this.updateIndex(_id);
  }

  componentDidUpdate ({
    visible: prevVisible,
    feature: { properties: { _id: prevId } = {} } = {},
  }) {
    const {
      visible,
      feature: { properties: { _id } = {} } = {},
    } = this.props;

    if (prevId !== _id) {
      this.updateIndex(_id);
    }

    if (visible !== prevVisible) {
      this.switchVisibility(visible);
    }
  }

  getIndexFeature = index => {
    const { features } = this.props;
    const featuresLength = features.length;
    if (index <= -1) {
      return featuresLength - 1;
    }
    if (index === featuresLength) {
      return 0;
    }
    return index;
  };

  handleChange = direction => {
    const { onChange } = this.props;
    const { index: prevIndex = 0 } = this.state;
    const index = this.getIndexFeature(prevIndex + direction);
    onChange(index);
    return this.setState({ index });
  };

  switchVisibility (visible) {
    if (visible) {
      clearTimeout(this.hideTimeout);
      this.setState({
        hidden: false,
      }, () => this.setState({
        visible: true,
      }));
    } else {
      this.setState({
        visible: false,
      });
      this.hideTimeout = setTimeout(() => this.setState({ hidden: true }), 200);
    }
  }

  updateIndex (id) {
    const { features = [] } = this.props;
    if (features.length) {
      this.setState({ index: features.findIndex(({ _id }) => _id === id) });
    }
  }

  render () {
    const {
      features,
      onClose,
      isTableActive,
      enableCarousel,
      translate = a => a,
    } = this.props;
    const {
      feature: { properties } = {},
      interaction: { template, fetchProperties = {}, templates = [] } = {},
      index, hidden, visible,
    } = this.state;
    const isCarousel = enableCarousel && features.length > 1;
    const featureToDisplay = features.length > 0 && index !== -1 ? features[index] : properties;

    return (
      <div
        className={classnames(
          {
            'view-details': true,
            'bp3-light': true,
            'view-details--hidden': hidden,
            'view-details--visible': visible,
            'view-details--withTable': isTableActive,
            'view-details--withCarousel': isCarousel,
          },
        )}
      >
        <div className="view-details__close">
          <Button
            type="button"
            className="view-details__close-button"
            onClick={onClose}
            icon="cross"
            minimal
          />
        </div>
        {featureToDisplay && (
          <div className="view-details__wrapper">
            {isCarousel && (
              <div
                className={classnames(
                  'view-details__button',
                  'view-details__button--prev',
                )}
              >
                <Button
                  type="button"
                  onClick={() => this.handleChange(-1)}
                  icon="chevron-left"
                  minimal
                />
              </div>
            )}
            {templates.length > 0 ? (
              <Tabs id="tabs" className="tab-bar">
                {templates.map((templateTab, idx) => (
                  <Tab
                    id={`tab-${idx}`}
                    title={templateTab.tabTitle}
                    panel={(
                      <div className="view-details__content">
                        <FeatureProperties
                          {...templateTab.fetchProperties}
                          properties={featureToDisplay}
                        >
                          {({ properties: newProperties, ...staticProperties }) => (
                            <ErrorBoundary errorMsg={translate('terralego.map.template.render.error')}>
                              <Template
                                template={templateTab.template}
                                {...staticProperties}
                                {...newProperties}
                              />
                            </ErrorBoundary>
                          )}
                        </FeatureProperties>
                      </div>
                    )}
                  />
                ))}
              </Tabs>
            )
              : (
                <div className="view-details__content">
                  <FeatureProperties
                    {...fetchProperties}
                    properties={featureToDisplay}
                  >
                    {({ properties: newProperties, ...staticProperties }) => (
                      <ErrorBoundary errorMsg={translate('terralego.map.template.render.error')}>
                        <Template
                          template={template}
                          {...staticProperties}
                          {...newProperties}
                        />
                      </ErrorBoundary>
                    )}
                  </FeatureProperties>
                </div>
              )}
            {isCarousel && (
              <div
                className={classnames(
                  'view-details__button',
                  'view-details__button--next',
                )}
              >
                <Button
                  type="button"
                  onClick={() => this.handleChange(1)}
                  icon="chevron-right"
                  minimal
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const propFeature = PropTypes.shape({
  properties: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    _id: PropTypes.any,
  }),
});
Details.propTypes = {
  feature: propFeature,
  interaction: PropTypes.shape({
    template: PropTypes.string,
    fetchProperties: PropTypes.shape(),
  }),
  features: PropTypes.arrayOf(propFeature),
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  enableCarousel: PropTypes.bool,
};

Details.defaultProps = {
  onChange () {},
  onClose: () => null,
  enableCarousel: true,
  features: [],
  feature: undefined,
  interaction: undefined,
};

export default Details;
