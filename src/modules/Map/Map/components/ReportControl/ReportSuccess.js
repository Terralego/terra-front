import React from 'react';
import { Button } from '@blueprintjs/core';

const ReportSucess = ({ newReport, endReport, translate: t }) => (
  <div>
    <p>{t('terralego.map.report_control.success.message')}</p>
    <Button onClick={newReport}>{t('terralego.map.report_control.success.other_report')}</Button>
    <Button onClick={endReport}>{t('terralego.map.report_control.success.done')}</Button>
  </div>
);

export default ReportSucess;
