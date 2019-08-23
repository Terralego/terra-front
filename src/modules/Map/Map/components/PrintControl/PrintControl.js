import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Button,
  Icon,
  Popover,
  PopoverInteractionKind,
  PopoverPosition,
  Radio,
  RadioGroup,
  Spinner,
  Tooltip,
} from '@blueprintjs/core';
import AbstractMapControl from '../../../helpers/AbstractMapControl';
import translateMock from '../../../../../utils/translate';

import './styles.scss';

const PRINT_CLASS_PREFIX = 'visualizer__print';
const ORIENTATION_PORTRAIT = 'portrait';
const ORIENTATION_LANDSCAPE = 'landscape';

export class PrintControl extends AbstractMapControl {
  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-print';

  static propTypes = {
    translate: PropTypes.func,
  };

  static defaultProps = {
    translate: translateMock({
      'terralego.map.print_control.button_label': 'Print to PDF',
      'terralego.map.print_control.portrait_label': 'Portrait',
      'terralego.map.print_control.lanscape_label': 'Landscape',
    }),
  }

  state = {
    orientation: 'landscape',
    isOpen: false,
    isExporting: false,
  };

  popoverRef = React.createRef();

  setClasses () {
    const { orientation, isOpen } = this.state;
    const { map } = this.props;
    const container = map.getContainer().parentElement;
    const isPortrait = orientation === ORIENTATION_PORTRAIT;
    const forDeletion = [
      PRINT_CLASS_PREFIX,
      `${PRINT_CLASS_PREFIX}--${ORIENTATION_PORTRAIT}`,
      `${PRINT_CLASS_PREFIX}--${ORIENTATION_LANDSCAPE}`,
    ];
    const oldClasses = container.className.split(' ').filter(item => !forDeletion.includes(item));
    container.className = classnames(
      ...oldClasses,
      isOpen && PRINT_CLASS_PREFIX,
      isOpen && isPortrait && `${PRINT_CLASS_PREFIX}--${ORIENTATION_PORTRAIT}`,
      isOpen && !isPortrait && `${PRINT_CLASS_PREFIX}--${ORIENTATION_LANDSCAPE}`,
    );
    this.popoverRef.current.reposition();
    map.resize();
  }

  handleInteraction = nextOpenedState => this.setState({
    isOpen: nextOpenedState,
  }, this.setClasses);

  handleDisposition = ({ target: { value: orientation } }) =>
    this.setState({ orientation }, this.setClasses);

  beginGeneration = () => this.setState({ isExporting: true }, async () => {
    const { orientation } = this.state;
    const { map } = this.props;
    const { default: exportPdf } = await import('./export');
    await exportPdf(map, orientation);
    this.setState({
      isOpen: false,
      isExporting: false,
    }, this.setClasses);
  });

  render () {
    const { translate } = this.props;
    const { orientation, isOpen, isExporting } = this.state;

    return (
      <Popover
        className="popoverPos"
        position={PopoverPosition.AUTO_START}
        interactionKind={PopoverInteractionKind.CLICK_TARGET_ONLY}
        onInteraction={this.handleInteraction}
        isOpen={isOpen}
        ref={this.popoverRef}
        content={(
          <>
            <RadioGroup
              label="Disposition"
              onChange={this.handleDisposition}
              selectedValue={orientation}
            >
              <Radio
                value={ORIENTATION_PORTRAIT}
                label={translate('terralego.map.print_control.portrait_label')}
              />
              <Radio
                value={ORIENTATION_LANDSCAPE}
                label={translate('terralego.map.print_control.lanscape_label')}
              />
            </RadioGroup>
            <Button onClick={this.beginGeneration} disabled={isExporting}>
              {isExporting ?
                <Spinner size={16} /> :
                translate('terralego.map.print_control.button_label')
              }
            </Button>
          </>
        )}
      >
        <Tooltip
          content={translate('terralego.map.print_control.button_label')}
        >
          <button
            className="mapboxgl-ctrl-icon"
            type="button"
            aria-label={translate('terralego.map.print_control.button_label')}
          >
            <Icon icon="print" />
          </button>
        </Tooltip>
      </Popover>
    );
  }
}

export default PrintControl;
