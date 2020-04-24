import React, { useState } from 'react';
import { Overlay, Card, Elevation } from '@blueprintjs/core';

import ReportForm from '../ReportForm';
import ReportSuccess from '../ReportSuccess';

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

  const title = submited ?
    'terralego.map.report_control.success.title' :
    'terralego.map.report_control.form.title';

  const onNewReport = () => {
    setSubmited(false);
    newReport();
  };

  const onEndReport = () => {
    setSubmited(false);
    endReport();
  };

  const submitReport = data => {
    setSubmited(true);
    onSubmit(data);
  };


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
        <h1>{t(title)}</h1>
        {submited
          && <ReportSuccess newReport={onNewReport} endReport={onEndReport} translate={t} />}

        {!submited
        && (
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
