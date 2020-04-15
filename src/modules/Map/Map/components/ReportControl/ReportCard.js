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
      <Card interactive elevation={Elevation.FOUR}>
        {(submited && <ReportSuccess newReport={onNewReport} endReport={endReport} />)
          || (
            <ReportForm
              onSubmit={submitReport}
              onCancel={cancelReport}
              coordinates={coordinates}
              url={reportUrl}
            />
          )}
      </Card>
    </Overlay>
  );
};

export default ReportCard;
