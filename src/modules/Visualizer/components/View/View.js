import React from 'react';
import PropTypes from 'prop-types';

import WidgetMap from '../../widgets/Map';

const Details = () => null;

export class View extends React.Component {
  static propTypes = {
    widgets: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['map']),
    })).isRequired,
  };

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

  generateWidgets () {
    const { widgets } = this.props;
    const widgetsComponents = widgets.map(({ type, ...props }, key) => {
      const widgetComponent = { ...props, key };
      switch (type) {
        case 'map':
          widgetComponent.Component = WidgetMap;
          break;
        default:
          throw new Error(`${type} widget is invalid`);
      }
      return widgetComponent;
    });
    this.setState({ widgetsComponents });
  }

  render () {
    const { details } = this.props;
    const { widgetsComponents } = this.state;

    return (
      <div className="visualizer-view">
        {widgetsComponents.map(({ Component, key, ...props }) => (
          <Component
            key={key}
            {...props}
          />
        ))}
        <Details
          visible={details}
        />
      </div>
    );
  }
}

export default View;
