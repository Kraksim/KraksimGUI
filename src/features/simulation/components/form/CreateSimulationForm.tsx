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

  const intersectionIds = data?.roadNodes
    .filter(roadNode => roadNode.type === 'INTERSECTION')
    .map(intersection => intersection.id) ?? [];
  
  const gatewayIds = data?.roadNodes
    .filter(roadNode => roadNode.type === 'GATEWAY')
    .map(gateway => gateway.id) ?? [];
  
  const roadIds = data?.roads.map(road => road.id) ?? [];

  const intersectionLanes = data?.roadNodes
    .filter(roadNode => roadNode.type === 'INTERSECTION')
    .map(intersection => ({
      intersectionId: intersection.id, 
      allowedLanesIds: intersection.endingRoads.flatMap(road => road.lanes).map(lane => lane.id),
    })) ?? [];

  const initialValues = {
    simulationBasicInfo: simulationBasicInfoInitialValues,
    movmentSimulationStrategy: movmentSimulationStrategyInitialValues,
    expectedVelocity: expectedVelocityInitialValues,
    lightPhaseStrategies: lightPhaseStrategiesInitialValues,
    trafficLights: getTrafficLightsInitialValues(intersectionIds),
    gatewaysStates: getGatewaysStatesInitialValues(gatewayIds),
  };

  return (
    <div>
      {data && (<Formik
        initialValues={initialValues}
        onSubmit={(values) => createSimulation(parseFormResultToRequest(values, mapId))}
        >
        {({ values }) => (
          <Form>
            <CreateSimulationBasicInfoForm/>
            <CreateMovmentSimulationStrategyForm />
            <CreateExpectedVelocityMapForm values={values.expectedVelocity} allowedRoadIds={roadIds} />
            <CreateGatewaysStatesForm values={values.gatewaysStates} allowedGatewayIds={gatewayIds} />
            <CreateTrafficLightsForm 
              values={values.trafficLights} 
              allowedIntersectionIds={intersectionIds} 
              intersectionLanes={intersectionLanes}
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