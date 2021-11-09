import React from 'react';

import SimulationList from './SimulationList';
import TestPopulateButton from './TestPopulateButton';
import SimulationFormWrapper from './form/SimulationFormWrapper';

export default function SimulationPage(): JSX.Element {


  return (
        <div>
            <TestPopulateButton/>
            <SimulationList/>
            <SimulationFormWrapper/>
        </div>
  );
}