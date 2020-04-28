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

  const wrongInfo = t('terralego.map.report_control.form.radio.wrong_info.label');
  const missingInfo = t('terralego.map.report_control.form.radio.missing_info.label');
  const wrongLocation = t('terralego.map.report_control.form.radio.wrong_location.label');
  const doesNotExists = t('terralego.map.report_control.form.radio.doesnotexist.label');

  return (
    <form onSubmit={submitReport} onReset={onCancel}>
      <input hidden name="lng" value={coordinates.lng} />
      <input hidden name="lat" value={coordinates.lat} />
      <FormGroup
        className="report-timestamp-id"
      >
        <InputGroup
          readOnly
          name="id"
          left-icon="id-number"
          defaultValue={Date.now()}
        />
      </FormGroup>
      <FormGroup
        label={t('terralego.map.report_control.form.radiogroup.label')}
      >
        <Radio
          label={wrongInfo}
          value={wrongInfo}
          name="reporttype"
          defaultChecked
        />
        <Radio
          label={missingInfo}
          value={missingInfo}
          name="reporttype"
        />
        <Radio
          label={wrongLocation}
          value={wrongLocation}
          name="reporttype"
        />
        <Radio
          label={doesNotExists}
          value={doesNotExists}
          name="reporttype"
        />
      </FormGroup>
      <FormGroup
        label={t('terralego.map.report_control.form.comment.label')}
        labelInfo={t('terralego.map.report_control.form.comment.optional')}
      >
        <TextArea large fill name="comment" />
      </FormGroup>
      <FormGroup
        className="report-url"
        label={t('terralego.map.report_control.form.url.label')}
      >
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
