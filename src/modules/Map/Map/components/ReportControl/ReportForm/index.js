import React from 'react';
import { Button, FormGroup, InputGroup, Radio, TextArea } from '@blueprintjs/core';

import './styles.scss';

export const ReportForm = ({ url, coordinates, onSubmit, onCancel, translate: t }) => {
  const submitReport = e => {
    e.preventDefault();
    const data = {};
    const fd = new FormData(e.target);
    fd.forEach((value, key) => { data[key] = value; });
    onSubmit(data);
  };

  return (
    <form onSubmit={submitReport} onReset={onCancel}>
      <input hidden name="lng" value={coordinates.lng} />
      <input hidden name="lat" value={coordinates.lat} />
      <FormGroup
        label={t('terralego.map.report_control.form.radiogroup.label')}
      >
        <Radio
          label={t('terralego.map.report_control.form.radio.wrong_info.label')}
          value="wrong_info"
          name="reportType"
          defaultChecked
        />
        <Radio
          label={t('terralego.map.report_control.form.radio.missing_info.label')}
          value="missing_info"
          name="reportType"
        />
        <Radio
          label={t('terralego.map.report_control.form.radio.wrong_location.label')}
          value="wrong_location"
          name="reportType"
        />
        <Radio
          label={t('terralego.map.report_control.form.radio.doesnotexist.label')}
          value="does_not_exist"
          name="reportType"
        />
      </FormGroup>
      <FormGroup>
        {t('terralego.map.report_control.form.comment.label')}
        <span className="bp3-text-muted"> ({t('terralego.map.report_control.form.comment.optional')})</span>
        <TextArea large fill name="comment" />
      </FormGroup>
      <FormGroup className="report-url">
        {t('terralego.map.report_control.form.url.label')}:
        <InputGroup large readOnly name="url" defaultValue={url} />
      </FormGroup>

      <FormGroup className="report-button-group">
        <Button
          type="reset"
          className="report-button"
        >
          {t('terralego.map.report_control.form.cancel')}
        </Button>
        <Button
          type="submit"
          id="submitReport"
          className="report-button"
        >
          {t('terralego.map.report_control.form.submit')}
        </Button>
      </FormGroup>
    </form>
  );
};
export default ReportForm;
