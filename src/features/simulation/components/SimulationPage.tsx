import React from 'react';

import { SimulationList, TestPopulateButton } from '.';
import CreateSimulationForm from './form/CreateSimulationForm';

export default function SimulationPage(): JSX.Element {
  return (
        <div>
            <TestPopulateButton/>
            <SimulationList/>
            <CreateSimulationForm/>
        </div>
  );
}