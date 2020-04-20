import React from 'react';
import { Button } from '@blueprintjs/core';

const ReportSucess = ({ newReport, endReport, translate: t }) => (
  <div>
    <h1>{t('map.report_control.success.title')}</h1>
    <p>{t('map.report_control.success.message')}</p>
    <Button onClick={newReport}>{t('map.report_control.success.other_report')}</Button>
    <Button onClick={endReport}>{t('map.report_control.success.done')}</Button>
  </div>
);

export default ReportSucess;