import React, { useState, useCallback } from 'react';
import { Overlay, Card, Elevation } from '@blueprintjs/core';

import ReportForm from './ReportForm';
import ReportSuccess from './ReportSuccess';

import './styles.scss';

export const ReportCard = ({
  isOpen,
  onSubmit,
  cancelReport,
  coordinates,
  reportUrl,
  newReport,
  endReport,
  translate: t,
}) => {
  const [submited, setSubmited] = useState(false);

  const onNewReport = useCallback(() => {
    setSubmited(false);
    newReport();
  }, [newReport]);

  const onEndReport = useCallback(() => {
    setSubmited(false);
    endReport();
  }, [endReport]);

  const submitReport = useCallback(value => {
    setSubmited(true);
    onSubmit(value);
  }, [onSubmit]);


  return (
    <Overlay
      autoFocus
      lazy
      canEscapeKeyClose
      isOpen={isOpen}
      onClose={cancelReport}
      className="overlay-container"
    >
      <Card
        interactive
        elevation={Elevation.FOUR}
        className="report-card"
      >
        {(submited
          && <ReportSuccess newReport={onNewReport} endReport={onEndReport} translate={t} />)
        || (
        <ReportForm
          onSubmit={submitReport}
          onCancel={cancelReport}
          coordinates={coordinates}
          url={reportUrl}
          translate={t}
        />
        )}
      </Card>
    </Overlay>
  );
};

export default ReportCard;
