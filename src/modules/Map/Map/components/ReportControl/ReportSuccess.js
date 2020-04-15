import React from 'react';
import { Button } from '@blueprintjs/core';

const ReportSucess = ({ newReport, endReport }) => (
  <div>
    <h1>Thank you!</h1>
    <p>Your report has been submited successfully</p>
    <Button onClick={newReport}>Do another report</Button>
    <Button onClick={endReport}>Ok</Button>
  </div>
);

export default ReportSucess;
