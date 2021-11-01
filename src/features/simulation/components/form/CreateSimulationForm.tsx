import React from 'react';

import { CreateExpectedVelocityMapForm } from './CreateExpectedVelocityMapForm';
import { CreateGatewaysStatesForm } from './CreateGatewaysStatesForm';
import { CreateLightPhaseStrategiesForm } from './CreateLightPhaseStrategiesForm';
import { CreateMovmentSimulationStrategyForm } from './CreateMovmentSimulationStrategyForm';
import { CreateSimulationBasicInfoForm } from './CreateSimulationBasicInfoForm';
import { CreateTrafficLightsForm } from './CreateTrafficLightsForm';

export default function CreateSimulationForm(): JSX.Element {

  return (
    <div>
      <CreateSimulationBasicInfoForm allowedMapIds={[2, 1, 3, 7]}/>
      <CreateMovmentSimulationStrategyForm/>
      <CreateExpectedVelocityMapForm allowedRoadIds={[2, 1, 3, 7]} />
      <CreateGatewaysStatesForm allowedGatewayIds={[2, 1, 3, 7]} />
      <CreateTrafficLightsForm allowedIntersectionIds={[2, 1, 3, 7]} allowedLaneIds={[2, 1, 3, 7]}/>
      <CreateLightPhaseStrategiesForm allowedIntersectionIds={[2, 1, 3, 7]} />
    </div>
  );
}