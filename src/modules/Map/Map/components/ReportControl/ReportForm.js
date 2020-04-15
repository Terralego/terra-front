import React, { useState, useCallback } from 'react';
import { Button, Label, RadioGroup, Radio, TextArea } from '@blueprintjs/core';

export const ReportForm = ({ url, coordinates, onSubmit, onCancel }) => {
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
        label="What do you want to report?"
        selectedValue={reportType}
        onChange={onReportTypeChange}
      >
        <Radio label="incorrect information" value="wrong_info" />
        <Radio label="missing information" value="missing_info" />
        <Radio label="incorrect location" value="wrong_location" />
        <Radio label="The element does not exists" value="does_not_exist" />
      </RadioGroup>
      <Label>
        Comment
        <span className="bp3-text-muted"> (optional)</span>
        <TextArea value={comment} onChange={onCommentChange} />
      </Label>
      <Label>
        report tracking url:
        <br />
        <a href={url}>http://{url}</a>
      </Label>

      <Button onClick={onCancel}>Cancel</Button>
      <Button type="submit">Report</Button>
    </form>
  );
};
export default ReportForm;
