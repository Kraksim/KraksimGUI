import React from 'react';

import { SimulationList, TestPopulateButton } from '.';

export default function SimulationPage(): JSX.Element {
  return (
        <div>
            <TestPopulateButton/>
            <SimulationList/>
        </div>
  );
}