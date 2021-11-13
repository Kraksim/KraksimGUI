import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';

import { useGetMapByIdQuery } from '../../../map/mapApi';
import { useCreateSimulationMutation } from '../../simulationApi';

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
  const [ createSimulation, result ] = useCreateSimulationMutation();

  useEffect(() => {
    if (result.data && !result.error){
      alert('Simulation created successfully!!');
      console.log(result.data);
    }
  }, [result]);

  const intersectionsSimplified = data?.roadNodes
    .filter(roadNode => roadNode.type === 'INTERSECTION')
    .map(({ name, id }) => ({ name, id })) ?? [];
  
  const gatewaysSimplified = data?.roadNodes
    .filter(roadNode => roadNode.type === 'GATEWAY')
    .map(({ name, id }) => ({ name, id })) ?? [];
  
  const roadsSimplified = data?.roads.map(({ name, id }) => ({ name, id })) ?? [];

  const intersectionLanes = data?.roadNodes
    .filter(roadNode => roadNode.type === 'INTERSECTION')
    .map(intersection => ({
      intersectionId: intersection.id, 
      allowedLanes: intersection.endingRoads.flatMap(road => road.lanes).map(({ name, id }) => ({ name, id })),
    })) ?? [];

  const initialValues = {
    simulationBasicInfo: simulationBasicInfoInitialValues,
    movmentSimulationStrategy: movmentSimulationStrategyInitialValues,
    expectedVelocity: expectedVelocityInitialValues,
    lightPhaseStrategies: lightPhaseStrategiesInitialValues,
    trafficLights: getTrafficLightsInitialValues(intersectionsSimplified.map(({ id }) => id)),
    gatewaysStates: getGatewaysStatesInitialValues(gatewaysSimplified.map(({ id }) => id)),
  };

  return (
    <div>
      {data && (<Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          const request = parseFormResultToRequest(values, mapId);
          console.log(request);
          createSimulation(request);
        }}
        >
        {({ values }) => (
          <Form>
            <CreateSimulationBasicInfoForm/>
            <CreateMovmentSimulationStrategyForm />
            <CreateExpectedVelocityMapForm values={values.expectedVelocity} allowedRoads={roadsSimplified} />
            <CreateGatewaysStatesForm values={values.gatewaysStates} allowedGateways={gatewaysSimplified} />
            <CreateTrafficLightsForm 
              values={values.trafficLights} 
              allowedIntersections={intersectionsSimplified} 
              intersectionLanes={intersectionLanes}
            />
            <CreateLightPhaseStrategiesForm 
              values={values.lightPhaseStrategies} 
              allowedIntersections={intersectionsSimplified} 
            />
            <ControlButton variant="contained" type="submit">Confirm values</ControlButton>
          </Form>
        )}
      </Formik>)}
    </div>
  );
}