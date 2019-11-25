import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from '@blueprintjs/core';

import FeatureProperties from '../../Map/FeatureProperties';
import Template from '../../Template';
import './styles.scss';

class Details extends React.Component {
  state = {
    index: -1,
    hidden: true,
  }

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
  }

  handleChange = direction => {
    const { onChange } = this.props;
    const { index: prevIndex = 0 } = this.state;
    const index = this.getIndexFeature(prevIndex + direction);
    onChange(index);
    return this.setState({ index });
  }

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
      onClose = () => null,
      isTableActive,
    } = this.props;
    const {
      feature: { properties } = {},
      interaction: { template, fetchProperties = {} } = {},
      index, hidden, visible,
    } = this.state;
    const isCarrousel = features.length > 1;
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
            'view-details--withCarousel': isCarrousel,
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
            {isCarrousel && (
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
            <div className="view-details__content">
              <FeatureProperties
                {...fetchProperties}
                properties={featureToDisplay}
              >
                {({ properties: newProperties, ...staticProperties }) => (
                  <Template
                    template={template}
                    {...staticProperties}
                    {...newProperties}
                  />
                )}
              </FeatureProperties>
            </div>
            {isCarrousel && (
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

Details.propTypes = {
  onChange: PropTypes.func,
};

Details.defaultProps = {
  onChange () {},
};

export default Details;
