import React, { useState, useCallback } from 'react';
import { Button, Label, RadioGroup, Radio, TextArea } from '@blueprintjs/core';

export const ReportForm = ({ url, coordinates, onSubmit, onCancel, translate: t }) => {
  const [comment, setComment] = useState('');
  const [reportType, setReportType] = useState('wrong_info');

  const onCommentChange = useCallback(e => setComment(e.currentTarget.value), []);
  const onReportTypeChange = useCallback(e => setReportType(e.currentTarget.value), []);

  const submitReport = useCallback(e => {
    e.preventDefault();
    onSubmit({ comment, coordinates, url, reportType });
  }, [onSubmit, comment, coordinates, url, reportType]);

  return (
    <form onSubmit={submitReport}>
      <input hidden id="report-geometry" value={coordinates} />
      <RadioGroup
        label={t('map.report_control.form.radiogroup.label')}
        selectedValue={reportType}
        onChange={onReportTypeChange}
      >
        <Radio
          label={t('map.report_control.form.radio.wrong_info.label')}
          value="wrong_info"
        />
        <Radio
          label={t('map.report_control.form.radio.missing_info.label')}
          value="missing_info"
        />
        <Radio
          label={t('map.report_control.form.radio.wrong_location.label')}
          value="wrong_location"
        />
        <Radio
          label={t('map.report_control.form.radio.doesnotexist.label')}
          value="does_not_exist"
        />
      </RadioGroup>
      <Label>
        {t('map.report_control.form.comment.label')}
        <span className="bp3-text-muted"> ({t('map.report_control.form.comment.optional')})</span>
        <TextArea value={comment} onChange={onCommentChange} />
      </Label>
      <Label>
        {t('map.report_control.form.url.label')}:
        <br />
        <a href={url}>{url}</a>
      </Label>

      <Button onClick={onCancel}>{t('map.report_control.form.cancel')}</Button>
      <Button type="submit" id="submitReport">{t('map.report_control.form.submit')}</Button>
    </form>
  );
};
export default ReportForm;
