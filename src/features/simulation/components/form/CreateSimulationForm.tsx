import { Alert, Snackbar, Box } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';

import MapVisualizer from '../../../map/MapVisualizer';
import { useGetBasicMapByIdQuery, useGetMapByIdQuery } from '../../../map/mapApi';
import { useCreateSimulationMutation } from '../../simulationApi';

import { ControlButton } from './common';
import CreateExpectedVelocityMapForm, { expectedVelocityInitialValues } from './CreateExpectedVelocityMapForm';
import CreateGatewaysStatesForm, { getGatewaysStatesInitialValues } from './CreateGatewaysStatesForm';
import CreateLightPhaseStrategiesForm, { lightPhaseStrategiesInitialValues } from './CreateLightPhaseStrategiesForm';
import CreateMovementSimulationStrategyForm, { 
  movementSimulationStrategyInitialValues, 
} from './CreateMovementSimulationStrategyForm';
import CreateSimulationBasicInfoForm, { simulationBasicInfoInitialValues } from './CreateSimulationBasicInfoForm';
import { parseFormResultToRequest } from './util';

export interface InitialValues<T> {
  values: T
}

interface Props {
  mapId: number
}

export default function CreateSimulationForm({ mapId }: Props): JSX.Element {
  const { data } = useGetMapByIdQuery(mapId);
  const { data: basicMap } = useGetBasicMapByIdQuery(mapId);
  const [ createSimulation, result ] = useCreateSimulationMutation();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
    
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (result.isError || result.isSuccess){
      setSnackbarOpen(true);
    }
  }, [result]);

  const intersectionsSimplified = data?.roadNodes
    .filter(roadNode => roadNode.type === 'INTERSECTION')
    .map(({ name, id }) => ({ name, id })) ?? [];
  
  const gatewaysSimplified = data?.roadNodes
    .filter(roadNode => roadNode.type === 'GATEWAY')
    .map(({ name, id }) => ({ name, id })) ?? [];
  
  const roadsSimplified = data?.roads.map(({ name, id }) => ({ name, id })) ?? [];

  const initialValues = {
    simulationBasicInfo: simulationBasicInfoInitialValues,
    movementSimulationStrategy: movementSimulationStrategyInitialValues,
    expectedVelocity: expectedVelocityInitialValues,
    lightPhaseStrategies: lightPhaseStrategiesInitialValues,
    gatewaysStates: getGatewaysStatesInitialValues(gatewaysSimplified.map(({ id }) => id)),
  };

  const errorData = (result.error as any)?.data;
  const errorMessage = errorData ? 'Something went wrong: ' + errorData :
    'Something went wrong, please check your connection.';
  return (
    <Box margin='0 10px' display="flex" justifyContent="stretch">
      {data && basicMap && (
      <>
      <Box sx={{ overflowY: 'scroll', height: '99vh' }}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log(values);
          const request = parseFormResultToRequest(values, mapId);
          console.log(request);
          createSimulation(request);
        }}
        >
        {({ values }) => (
          <Form>
            <CreateSimulationBasicInfoForm/>
            <CreateMovementSimulationStrategyForm compatibleStrategies={data.compatibleWith}/>
            <CreateExpectedVelocityMapForm values={values.expectedVelocity} allowedRoads={roadsSimplified} />
            <CreateGatewaysStatesForm values={values.gatewaysStates} allowedGateways={gatewaysSimplified} />
            <CreateLightPhaseStrategiesForm 
              values={values.lightPhaseStrategies} 
              allowedIntersections={intersectionsSimplified} 
            />
            <ControlButton variant="contained" type="submit">Confirm values</ControlButton>
          </Form>
        )}
      </Formik>
      </Box>
      <MapVisualizer map={basicMap}/>
      </>)}
      <Snackbar open={snackbarOpen} autoHideDuration={result.isError ? 15000 : 3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={result.isError ? 'error' : 'success'} sx={{ width: '100%' }}>
          {result.isError ? errorMessage : 'Simulation created successfully!'}
        </Alert>
      </Snackbar>
    </Box>
  );
}