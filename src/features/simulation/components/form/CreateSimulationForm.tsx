import { Form, Formik } from 'formik';
import React from 'react';

import { useGetMapByIdQuery } from '../../../map/mapApi';

import { ControlButton } from './common';
import { CreateExpectedVelocityMapForm, expectedVelocityInitialValues } from './CreateExpectedVelocityMapForm';
import { CreateGatewaysStatesForm, getGatewaysStatesInitialValues } from './CreateGatewaysStatesForm';
import { CreateLightPhaseStrategiesForm, lightPhaseStrategiesInitialValues } from './CreateLightPhaseStrategiesForm';
import { 
  CreateMovmentSimulationStrategyForm, 
  movmentSimulationStrategyInitialValues, 
} from './CreateMovmentSimulationStrategyForm';
import { CreateSimulationBasicInfoForm, simulationBasicInfoInitialValues } from './CreateSimulationBasicInfoForm';
import { CreateTrafficLightsForm, getTrafficLightsInitialValues } from './CreateTrafficLightsForm';
import { parseFormResultToRequest } from './util';

export interface InitialValues<T> {
  values: T
}

interface Props {
  mapId: number
}

export default function CreateSimulationForm({ mapId }: Props): JSX.Element {
  const { data } = useGetMapByIdQuery(mapId);
  const intersectionIds = [2, 1, 3, 7];
  const gatewayIds = [1, 4, 8, 9];

  const initialValues = {
    simulationBasicInfo: simulationBasicInfoInitialValues,
    movmentSimulationStrategy: movmentSimulationStrategyInitialValues,
    expectedVelocity: expectedVelocityInitialValues,
    lightPhaseStrategies: lightPhaseStrategiesInitialValues,
    trafficLights: getTrafficLightsInitialValues(intersectionIds),
    gatewaysStates: getGatewaysStatesInitialValues(gatewayIds),
  };

  console.log(initialValues);

  return (
    <div>
      {data && (<Formik
        initialValues={initialValues}
        onSubmit={(values) => console.log(parseFormResultToRequest(values, mapId))}
        >
        {({ values }) => (
          <Form>
            <CreateSimulationBasicInfoForm/>
            <CreateMovmentSimulationStrategyForm />
            <CreateExpectedVelocityMapForm values={values.expectedVelocity} allowedRoadIds={[2, 1, 3, 7]} />
            <CreateGatewaysStatesForm values={values.gatewaysStates} allowedGatewayIds={gatewayIds} />
            <CreateTrafficLightsForm 
              values={values.trafficLights} 
              allowedIntersectionIds={intersectionIds} 
              allowedLaneIds={[2, 1, 3, 7]}
            />
            <CreateLightPhaseStrategiesForm 
              values={values.lightPhaseStrategies} 
              allowedIntersectionIds={intersectionIds} 
            />
            <ControlButton variant="contained" type="submit">Confirm values</ControlButton>
          </Form>
        )}
      </Formik>)}
    </div>
  );
}