import React, { useState, useCallback } from 'react';
import { Overlay, Card, Elevation } from '@blueprintjs/core';

import ReportForm from './ReportForm';
import ReportSuccess from './ReportSuccess';

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

  const submitReport = useCallback(value => {
    setSubmited(true);
    onSubmit(value);
  }, [onSubmit]);


  return (
    <Overlay
      autoFocus
      lazy
      canOutsideClickClose
      canEscapeKeyClose
      isOpen={isOpen}
      onClose={cancelReport}
    >
      <Card
        interactive
        elevation={Elevation.FOUR}
        className="report-card"
      >
        {(submited && <ReportSuccess newReport={onNewReport} endReport={endReport} translate={t} />)
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
