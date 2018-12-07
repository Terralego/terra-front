import React from 'react';
import PropTypes from 'prop-types';

import WidgetMap from '../../widgets/Map';
import Details from '../Details';

import './styles.scss';

export class View extends React.Component {
  static propTypes = {
    widgets: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['map']),
    })).isRequired,
    DetailsComponent: PropTypes.func,
  };

  static defaultProps = {
    DetailsComponent: Details,
  }

  state = {
    widgetsComponents: [],
  };

  componentDidMount () {
    this.generateWidgets();
  }

  componentDidUpdate ({ widgets: prevWidgets }) {
    const { widgets } = this.props;
    if (widgets !== prevWidgets) {
      this.generateWidgets();
    }
  }

  closeDetails = () => {
    const { setDetails } = this.props;
    setDetails(null);
  }

  generateWidgets () {
    const { widgets } = this.props;
    const widgetsComponents = widgets.map(({ type, ...props }, key) => {
      const widgetComponent = { ...props, key };
      switch (type) {
        case 'map':
          widgetComponent.Component = WidgetMap;
          break;
        default:
          throw new Error('Invalid widget type');
      }
      return widgetComponent;
    });
    this.setState({ widgetsComponents });
  }

  render () {
    const { DetailsComponent, details } = this.props;
    const { widgetsComponents } = this.state;
    const { closeDetails } = this;
    const visible = !!details;
    const { features: [{ properties }] = [{}], template = '' } = details || {};

    return (
      <div className="visualizer-view">
        {widgetsComponents.map(({ Component, key, ...props }) => (
          <Component
            key={key}
            {...props}
          />
        ))}
        <DetailsComponent
          visible={visible}
          template={template}
          onClose={closeDetails}
          {...properties}
        />
      </div>
    );
  }
}

export default View;
